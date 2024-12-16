import { ChainData } from 'src/types';
import { PriceProviderPriorityType, PRICE_PROVIDER_PRIORITY_TYPE, PriceProviderType, PRICE_PROVIDER_TYPE, ALL_PROVIDERS } from '.';
import { IPriceService } from './IPriceService';
import { CoingeckoPriceProvider } from './provider/coingecko';
import { DefiLlamaPriceProvider } from './provider/defiLlama';
import { DzapPriceProvider } from './provider/dzap';

export class PriceService {
  private providers: Map<PriceProviderType, IPriceService>;

  constructor() {
    this.providers = this.createProviderMap();
  }

  private createProviderMap(): Map<PriceProviderType, IPriceService> {
    return new Map<PriceProviderType, IPriceService>([
      [PRICE_PROVIDER_TYPE.COINGECKO, new CoingeckoPriceProvider()],
      [PRICE_PROVIDER_TYPE.DEFI_LLAMA, new DefiLlamaPriceProvider()],
      [PRICE_PROVIDER_TYPE.DZAP, new DzapPriceProvider()],
    ]);
  }

  private selectProviders(
    priorityType: PriceProviderPriorityType = PRICE_PROVIDER_PRIORITY_TYPE.DEFAULT,
    allowedProviders: PriceProviderType[] = ALL_PROVIDERS,
  ): IPriceService[] {
    return Array.from(this.providers.values())
      .filter((provider) => (!allowedProviders || allowedProviders.includes(provider.getId())) && provider.getPriorities().includes(priorityType))
      .sort((a, b) => {
        const aPriority = a.getPriorities().indexOf(priorityType);
        const bPriority = b.getPriorities().indexOf(priorityType);
        return aPriority - bPriority;
      });
  }

  async getPrices({
    chainId,
    tokenAddresses,
    chainConfig,
    priorityType = PRICE_PROVIDER_PRIORITY_TYPE.DEFAULT,
    allowedProviders = ALL_PROVIDERS,
  }: {
    chainId: number;
    tokenAddresses: string[];
    chainConfig: ChainData;
    priorityType?: PriceProviderPriorityType;
    allowedProviders?: PriceProviderType[];
  }): Promise<Record<string, string | null>> {
    if (!tokenAddresses || tokenAddresses.length === 0) {
      console.warn('No token addresses provided');
      return {};
    }
    const providersToTry = this.selectProviders(priorityType, allowedProviders);

    const finalPrices: Record<string, string | null> = {};
    const remainingTokens = new Set(tokenAddresses);

    for (const provider of providersToTry) {
      if (remainingTokens.size === 0) break;
      const tokenList = Array.from(remainingTokens);
      const fetchedPrices = await provider.fetchPrices(chainId, tokenList, chainConfig);
      for (const [address, price] of Object.entries(fetchedPrices)) {
        if (price !== null) {
          finalPrices[address] = price;
          remainingTokens.delete(address);
        }
      }
    }
    if (remainingTokens.size > 0) {
      console.warn('Prices not found for tokens:', Array.from(remainingTokens));
    }

    return finalPrices;
  }
}
