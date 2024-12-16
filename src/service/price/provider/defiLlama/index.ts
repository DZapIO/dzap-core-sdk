import { GET } from 'src/constants/httpMethods';
import { ChainData } from 'src/types';
import { invoke } from 'src/utils/axios';
import { defiLlamaConfig } from './config';
import { DefiLlamaResponse } from './types';
import { IPriceService } from '../../IPriceService';
import { PRICE_PROVIDER_PRIORITY_TYPE, PRICE_PROVIDER_TYPE, PriceProviderPriorityType, PriceProviderType } from '../..';

export class DefiLlamaPriceProvider implements IPriceService {
  getId(): PriceProviderType {
    return PRICE_PROVIDER_TYPE.DEFI_LLAMA;
  }

  getPriorities(): PriceProviderPriorityType[] {
    return [PRICE_PROVIDER_PRIORITY_TYPE.FAST, PRICE_PROVIDER_PRIORITY_TYPE.DEFAULT, PRICE_PROVIDER_PRIORITY_TYPE.RELIABLE];
  }
  private preProcess = (chainId: number, tokenAddresses: string[], chainConfig: ChainData) => {
    const { name } = chainConfig[chainId];
    if (!name) return [];
    return tokenAddresses.map((address) => `${name}:${address}`);
  };

  private postProcess = (chainId: number, tokenAddresses: string[], chainConfig: ChainData, respose: DefiLlamaResponse) => {
    const { name } = chainConfig[chainId];
    if (!name) return {};
    return tokenAddresses.reduce<Record<string, string | null>>((acc, address) => {
      const token = respose.coins[`${name}:${address}`];
      if (!token) {
        acc[address] = null;
        return acc;
      }
      acc[address] = token.price.toString();
      return acc;
    }, {});
  };

  public fetchPrices = async (chainId: number, tokenAddresses: string[], chainConfig: ChainData): Promise<Record<string, string | null>> => {
    try {
      const requestTokens = this.preProcess(chainId, tokenAddresses, chainConfig);
      if (!requestTokens.length) return {};
      const response: DefiLlamaResponse = await invoke({
        endpoint: defiLlamaConfig.url(requestTokens),
        method: GET,
      });
      return this.postProcess(chainId, tokenAddresses, chainConfig, response);
    } catch (e) {
      return {};
    }
  };
}
