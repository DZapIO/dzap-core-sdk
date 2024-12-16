import { ChainData } from 'src/types';
import { PriceProviderType } from '.';

export type IPriceProvider = {
  id: PriceProviderType;
  requiresChainConfig: boolean;
  fetchPrices(chainId: number, tokenAddresses: string[], chainConfig: ChainData | null): Promise<Record<string, string | null>>;
  allowedSources?: PriceProviderType[];
  notAllowedSources?: PriceProviderType[];
};
