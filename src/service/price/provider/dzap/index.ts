import { fetchTokenPrice } from 'src/api';
import { IPriceProvider } from '../../IPriceProvider';
import { PriceProviders } from '../..';

export class DzapPriceProvider implements IPriceProvider {
  public id = PriceProviders.dZap;
  public requiresChainConfig = false;

  public fetchPrices = async (chainId: number, tokenAddresses: string[]): Promise<Record<string, string | null>> => {
    try {
      const tokenPrices = await fetchTokenPrice(tokenAddresses, chainId);
      return Promise.resolve(tokenPrices);
    } catch (e) {
      console.error('Failed to fetch token price', e);
      return {};
    }
  };
}
