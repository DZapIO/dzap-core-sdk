import { ChainData } from 'src/types';
import { IPriceProvider } from './IPriceProvider';
import { CoingeckoPriceProvider } from './provider/coingecko';
import { DefiLlamaPriceProvider } from './provider/defiLlama';
import { DzapPriceProvider } from './provider/dzap';
import { PriceProviders, PriceProviderType } from '.';

export class PriceService {
  private providers: Map<PriceProviderType, IPriceProvider>;

  constructor() {
    this.providers = this.createProvidersMap();
  }

  private createProvidersMap(): Map<PriceProviderType, IPriceProvider> {
    return new Map<PriceProviderType, IPriceProvider>([
      [PriceProviders.dZap, new DzapPriceProvider()],
      [PriceProviders.defiLlama, new DefiLlamaPriceProvider()],
      [PriceProviders.coingecko, new CoingeckoPriceProvider()],
    ]);
  }

  async getPrices({
    chainId,
    tokenAddresses,
    chainConfig,
    allowedSources,
    notAllowSources = [],
  }: {
    chainId: number;
    tokenAddresses: string[];
    chainConfig: ChainData | null;
    allowedSources?: PriceProviderType[];
    notAllowSources?: PriceProviderType[];
  }): Promise<Record<string, string | null>> {
    if (!tokenAddresses || tokenAddresses.length === 0) {
      console.warn('No token addresses provided');
      return {};
    }

    const validProviders = this.getValidProviders({ allowedSources, notAllowSources, chainConfig });

    if (validProviders.length === 0) {
      console.warn('No valid providers available based on the provided constraints');
      return {};
    }

    const result: Record<string, string | null> = {};
    let remainingTokens = [...tokenAddresses];

    for (const provider of validProviders) {
      if (remainingTokens.length === 0) break;

      const fetchedPrices = await provider.fetchPrices(chainId, remainingTokens, chainConfig);
      remainingTokens = this.updateTokensPrice(fetchedPrices, result, remainingTokens);
    }

    if (remainingTokens.length > 0) {
      console.warn('Prices not found for tokens:', remainingTokens);
    }

    return result;
  }

  private getValidProviders({
    allowedSources,
    notAllowSources,
    chainConfig,
  }: {
    allowedSources?: PriceProviderType[];
    notAllowSources?: PriceProviderType[];
    chainConfig: ChainData | null;
  }): IPriceProvider[] {
    return Array.from(this.providers.values()).filter((provider) => {
      const isInAllowedSources = allowedSources?.includes(provider.id) ?? true;
      const isInNotAllowedSources = notAllowSources?.includes(provider.id) ?? false;

      const isAllowed = allowedSources ? isInAllowedSources && !isInNotAllowedSources : !isInNotAllowedSources;

      if (provider.requiresChainConfig && !chainConfig) {
        console.error(`Provider ${provider.id} requires chainConfig but none was provided.`);
        return false;
      }

      return isAllowed;
    });
  }

  private updateTokensPrice(
    fetchedPrices: Record<string, string | null>,
    finalPrices: Record<string, string | null>,
    remainingTokens: string[],
  ): string[] {
    return remainingTokens.filter((token) => {
      const price = fetchedPrices[token];
      if (price !== null) {
        finalPrices[token] = price;
        return false;
      }
      return true;
    });
  }
}
