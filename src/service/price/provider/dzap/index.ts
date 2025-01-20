import { fetchTokenPrice } from 'src/api';
import { IPriceProvider, priceProviders } from '../../types/IPriceProvider';

export class DzapPriceProvider implements IPriceProvider {
  public id = priceProviders.dZap;
  public requiresChainConfig = false;

  public fetchPrices = async (chainId: number, tokenAddresses: string[]): Promise<Record<string, string | null>> => {
    try {
      const tokenPrices = await fetchTokenPrice(tokenAddresses, chainId);
      return tokenPrices;
    } catch (e) {
      console.error('Failed to fetch token price', e);
      return {};
    }
  };
}
