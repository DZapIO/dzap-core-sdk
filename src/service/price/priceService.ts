import { ChainData } from 'src/types';
import { CoingeckoPriceProvider } from './provider/coingecko';
import { fetchTokenPrice } from 'src/api';

export class PriceService {
  private priceProvider;
  constructor() {
    this.priceProvider = new CoingeckoPriceProvider();
  }

  getPriceFromProvider = async (chainId: number, tokenAddresses: string[], chainConfig: ChainData | null): Promise<Record<string, number | null>> => {
    if (!chainConfig) return {};
    return this.priceProvider.getPriceFromCoingecko(tokenAddresses, chainId, chainConfig);
  };

  getPriceForToken = async (chainId: number, tokenAddress: string, chainConfig: ChainData): Promise<string> => {
    try {
      const tokenPrices = await fetchTokenPrice([tokenAddress], chainId);
      return tokenPrices[tokenAddress] || (await this.getPriceFromProvider(chainId, [tokenAddress], chainConfig))[tokenAddress]?.toString() || '0';
    } catch {
      console.error('Failed to fetch token price');
      return '0';
    }
  };

  getPriceForTokens = async (chainId: number, tokenAddresses: string[], chainConfig: ChainData): Promise<Record<string, string | null>> => {
    try {
      const tokenPrices = await fetchTokenPrice(tokenAddresses, chainId);
      const missingTokens = tokenAddresses.filter((address) => !tokenPrices[address]);
      const fetchedPrices = await this.getPriceFromProvider(chainId, missingTokens, chainConfig);
      return tokenAddresses.reduce(
        (acc, address) => {
          acc[address] = tokenPrices[address] || fetchedPrices[address]?.toString() || '0';
          return acc;
        },
        {} as Record<string, string | null>,
      );
    } catch (error) {
      return tokenAddresses.reduce(
        (acc, address) => {
          acc[address] = '0';
          return acc;
        },
        {} as Record<string, string | null>,
      );
    }
  };
}
