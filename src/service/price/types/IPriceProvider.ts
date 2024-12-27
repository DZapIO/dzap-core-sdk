import { ChainData } from 'src/types';

export const priceProviders = {
  dZap: 'dZap',
  defiLlama: 'defiLlama',
  coingecko: 'coingecko',
} as const;

export type PriceProvider = (typeof priceProviders)[keyof typeof priceProviders];

export type IPriceProvider = {
  id: PriceProvider;
  requiresChainConfig: boolean;
  fetchPrices(chainId: number, tokenAddresses: string[], chainConfig: ChainData | null): Promise<Record<string, string | null>>;
  allowedSources?: PriceProvider[];
  notAllowedSources?: PriceProvider[];
};
