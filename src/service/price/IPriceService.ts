import { ChainData } from 'src/types';
import { PriceProviderPriorityType, PriceProviderType } from '.';

export type IPriceService = {
  getId(): PriceProviderType;
  getPriorities(): PriceProviderPriorityType[];
  fetchPrices(chainId: number, tokenAddresses: string[], chainConfig?: ChainData): Promise<Record<string, string | null>>;
};
