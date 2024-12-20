import { PriceService } from 'src/service/price';
import { priceProviders } from 'src/service/price/types/IPriceProvider';
import { ChainData } from 'src/types';
import { TokenResponse } from 'src/types/token';

export const isNativeCurrency = (address: string, chainConfig: ChainData) => {
  if (!chainConfig) return false;
  return Object.values(chainConfig).some(({ nativeToken }) => nativeToken.contract === address);
};

export const updateTokenListPrices = async (
  tokens: TokenResponse,
  chainId: number,
  chainConfig: ChainData,
  priceService: PriceService,
): Promise<TokenResponse> => {
  const tokensWithoutPrice = Object.values(tokens)
    .filter(({ price, balance }) => (!price || price === '0') && balance !== '0')
    .map(({ contract }) => contract);

  if (tokensWithoutPrice.length === 0) return tokens;

  try {
    const fetchedPrices = await priceService.getPrices({
      chainId,
      tokenAddresses: tokensWithoutPrice,
      chainConfig,
      notAllowSources: [priceProviders.dZap],
    });
    return Object.keys(tokens).reduce((acc, key) => {
      acc[key] = {
        ...tokens[key],
        price: fetchedPrices[key] || tokens[key].price,
      };
      return acc;
    }, {} as TokenResponse);
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return tokens;
  }
};
