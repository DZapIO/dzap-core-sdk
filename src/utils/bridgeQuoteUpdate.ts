import { BridgeQuoteRequest, BridgeQuoteResponse, ChainData, FeeDetails } from 'src/types';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { PriceService } from 'src/service/price/priceService';
import { getDecimalsFromBridge } from './getDecimals';
import { nativeTokens } from './tokens';

export const bridgeQuoteUpdate = async (
  quotes: BridgeQuoteResponse,
  request: BridgeQuoteRequest,
  priceService: PriceService,
  chainConfig: ChainData | null,
): Promise<BridgeQuoteResponse> => {
  const tokensWithoutPrice: Record<number, string[]> = {};

  Object.values(quotes).forEach((quote) => {
    if (quote.tokensWithoutPrice) {
      Object.entries(quote.tokensWithoutPrice).forEach(([chainIdStr, tokens]) => {
        const chainId = Number(chainIdStr);
        if (!tokensWithoutPrice[chainId]) {
          tokensWithoutPrice[chainId] = [];
        }
        const uniqueTokens = new Set(tokensWithoutPrice[chainId]);
        tokens.forEach((token) => uniqueTokens.add(token));
        tokensWithoutPrice[chainId] = Array.from(uniqueTokens);
      });
    }
  });

  if (Object.keys(tokensWithoutPrice).length === 0) {
    return quotes;
  }
  const tokensPrice: Record<number, Record<string, number | null>> = Object.fromEntries(
    await Promise.all(
      Object.entries(tokensWithoutPrice).map(async ([chainIdStr, tokens]) => {
        const chainId = Number(chainIdStr);
        const prices = await priceService.getPriceFromProvider(chainId, tokens, chainConfig);
        return [chainId, prices];
      }),
    ),
  );

  for (const quote of Object.values(quotes)) {
    if (!quote.quoteRates) continue;

    for (const data of Object.values(quote.quoteRates)) {
      if (data.srcAmountUSD && data.destAmountUSD) continue;

      const tokensDecimal = getDecimalsFromBridge(request, data.srcToken.address, data.destToken.address);
      if (!tokensDecimal) continue;

      const { srcDecimals, destDecimals, toChainId } = tokensDecimal;

      const srcAmount = formatUnits(BigInt(data.srcAmount), srcDecimals);
      const destAmount = formatUnits(BigInt(data.destAmount), destDecimals);

      const srcTokenPricePerUnit = tokensPrice[request.fromChain]?.[data.srcToken.address] || '0';
      const destTokenPricePerUnit = tokensPrice[toChainId]?.[data.destToken.address] || '0';

      const srcAmountUSD = BigNumber(srcAmount).multipliedBy(srcTokenPricePerUnit);
      const destAmountUSD = BigNumber(destAmount).multipliedBy(destTokenPricePerUnit);

      data.srcAmountUSD = +srcAmountUSD ? srcAmountUSD.toFixed() : '0';
      data.destAmountUSD = +destAmountUSD ? destAmountUSD.toFixed() : '0';

      if (+srcAmountUSD && +destAmountUSD) {
        const priceImpact = destAmountUSD.minus(srcAmountUSD).div(srcAmountUSD).multipliedBy(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      const updateFeeAmountUSD = async (fees: FeeDetails[], tokenPriceMap: Record<number, Record<string, number | null>>) => {
        for (const fee of fees) {
          if (fee.amountUSD && fee.amountUSD !== '0') continue;

          const pricePerUnit = tokenPriceMap[request.fromChain]?.[fee.address] || '0';
          fee.amountUSD = BigNumber(formatUnits(BigInt(fee.amount), fee.decimals))
            .multipliedBy(pricePerUnit)
            .toFixed();
        }
      };

      const { gasFee, protocolFee, providerFee } = data.fee;
      const hasNativeToken = tokensWithoutPrice[request.fromChain]?.some((token) => nativeTokens.includes(token));

      if (hasNativeToken) {
        await Promise.all([updateFeeAmountUSD(gasFee, tokensPrice), updateFeeAmountUSD(protocolFee, tokensPrice)]);
      }
      await updateFeeAmountUSD(providerFee, tokensPrice);
      data.path = data.path.map((path) => {
        return {
          ...path,
          fee: data.fee,
          srcAmountUSD: data.srcAmountUSD,
          destAmountUSD: data.destAmountUSD,
        };
      });
    }
  }

  return quotes;
};
