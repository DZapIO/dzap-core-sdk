import { ChainData } from 'src/types';
import { invoke } from 'src/utils/axios';
import { IPriceProvider, priceProviders } from '../../types/IPriceProvider';
import { symbiosisConfig } from './config';
import { SymbiosisRequest, SymbiosisResponse } from './types';
import { formatToken } from 'src/utils/tokens';

export class SymbiosisPriceProvider implements IPriceProvider {
  public id = priceProviders.symbiosis;
  public requiresChainConfig = true;

  private preProcess = (chainId: number, tokenAddresses: string[]) => {
    return tokenAddresses.map((address) => ({
      address,
      chain_id: chainId,
    }));
  };

  private postProcess = (chainId: number, chainConfig: ChainData, respose: SymbiosisResponse[]) => {
    const { name } = chainConfig[chainId];
    if (!name) return {};
    return respose.reduce<Record<string, string | null>>((acc, tokenInfo) => {
      const token = formatToken(tokenInfo.address, chainId, chainConfig);
      if (!token) {
        acc[token] = null;
        return acc;
      }
      acc[token] = tokenInfo.price.toString();
      return acc;
    }, {});
  };

  public fetchPrices = async (chainId: number, tokenAddresses: string[], chainConfig: ChainData): Promise<Record<string, string | null>> => {
    try {
      const data: SymbiosisRequest[] = this.preProcess(chainId, tokenAddresses);
      if (!data.length) return {};
      const response = await invoke({
        endpoint: symbiosisConfig.url,
        data: data,
      });
      return this.postProcess(chainId, chainConfig, response);
    } catch (e) {
      return {};
    }
  };
}
