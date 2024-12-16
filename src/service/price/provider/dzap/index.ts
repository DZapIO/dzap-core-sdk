import { fetchTokenPrice } from 'src/api';
import { PRICE_PROVIDER_PRIORITY_TYPE, PRICE_PROVIDER_TYPE, PriceProviderPriorityType, PriceProviderType } from '../..';
import { IPriceService } from '../../IPriceService';

export class DzapPriceProvider implements IPriceService {
  getId(): PriceProviderType {
    return PRICE_PROVIDER_TYPE.DZAP;
  }

  getPriorities(): PriceProviderPriorityType[] {
    return [PRICE_PROVIDER_PRIORITY_TYPE.DEFAULT, PRICE_PROVIDER_PRIORITY_TYPE.RELIABLE, PRICE_PROVIDER_PRIORITY_TYPE.FAST];
  }
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
