import { PriceService } from 'src/service/price';
import { priceProviders } from 'src/service/price/types/IPriceProvider';
import { ChainData, TokenResponse } from 'src/types';
import { formatUnits } from 'viem';

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
  try {
    const tokensWithoutPrice = Object.values(tokens)
      .filter(({ price, balance }) => (!price || price === '0') && balance !== '0')
      .map(({ contract }) => contract);

    if (tokensWithoutPrice.length === 0) return tokens;

    const fetchedPrices = await priceService.getPrices({
      chainId,
      tokenAddresses: tokensWithoutPrice,
      chainConfig,
      notAllowSources: [priceProviders.dZap],
    });

    tokensWithoutPrice.forEach((token) => {
      tokens[token].price = fetchedPrices[token] || tokens[token].price;
      tokens[token].balanceInUsd = fetchedPrices[token]
        ? parseFloat(fetchedPrices[token]) * parseFloat(formatUnits(BigInt(tokens[token].balance), tokens[token].decimals))
        : null;
    });
    return tokens;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return tokens;
  }
};
