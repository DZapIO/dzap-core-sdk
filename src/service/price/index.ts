export const PriceProviders = {
  dZap: 'dZap',
  defiLlama: 'defiLlama',
  coingecko: 'coingecko',
} as const;

export type PriceProviderType = (typeof PriceProviders)[keyof typeof PriceProviders];
