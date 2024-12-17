import { ChainData } from 'src/types';

export const isNativeCurrency = (address: string, chainConfig: ChainData) => {
  if (!chainConfig) return false;
  return Object.values(chainConfig).some(({ nativeToken }) => nativeToken.contract === address);
};
