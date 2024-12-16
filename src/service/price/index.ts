export const PRICE_PROVIDER_TYPE = {
  COINGECKO: 'coingecko',
  DEFI_LLAMA: 'defiLlama',
  DZAP: 'dzap',
} as const;

export type PriceProviderType = (typeof PRICE_PROVIDER_TYPE)[keyof typeof PRICE_PROVIDER_TYPE];

export const PRICE_PROVIDER_PRIORITY_TYPE = {
  DEFAULT: 'default',
  FAST: 'fast',
  RELIABLE: 'reliable',
} as const;

export type PriceProviderPriorityType = (typeof PRICE_PROVIDER_PRIORITY_TYPE)[keyof typeof PRICE_PROVIDER_PRIORITY_TYPE];

export const ALL_PROVIDERS: PriceProviderType[] = Object.values(PRICE_PROVIDER_TYPE);

export const EXTERNAL_PROVIDERS: PriceProviderType[] = ALL_PROVIDERS.filter((provider) => provider !== PRICE_PROVIDER_TYPE.DZAP);
