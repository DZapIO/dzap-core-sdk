import { BridgeQuoteRequest, BridgeQuoteResponse, ChainData, FeeDetails } from 'src/types';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { PriceService } from 'src/service/price/priceService';
import { nativeTokens } from './tokens';
import { checkUsdExistForToken } from './checkUsdExistForToken';

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
      if (checkUsdExistForToken(data)) {
        break;
      }

      const tokensDetails = request.data.find((d) => d.srcToken === data.srcToken.address && d.destToken === data.destToken.address);
      if (!tokensDetails) {
        break;
      }
      const { srcDecimals, destDecimals, toChain } = tokensDetails;

      const srcAmount = formatUnits(BigInt(data.srcAmount), srcDecimals);
      const destAmount = formatUnits(BigInt(data.destAmount), destDecimals);

      const srcTokenPricePerUnit = tokensPrice[request.fromChain]?.[data.srcToken.address] || 0;
      const destTokenPricePerUnit = tokensPrice[toChain]?.[data.destToken.address] || 0;

      const calculateAmountUSD = (amount: string | number, pricePerUnit: number) => {
        const amountUSD = BigNumber(amount).multipliedBy(pricePerUnit);
        return +amountUSD ? amountUSD.toFixed() : '0';
      };

      data.srcAmountUSD = calculateAmountUSD(srcAmount, srcTokenPricePerUnit);
      data.destAmountUSD = calculateAmountUSD(destAmount, destTokenPricePerUnit);

      if (data.srcAmountUSD && data.destAmountUSD) {
        const priceImpact = BigNumber(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).multipliedBy(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      if (data.srcAmountUSD && data.destAmountUSD) {
        const priceImpact = BigNumber(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).multipliedBy(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      const updateFeeAmountUSD = async (fees: FeeDetails[], tokenPriceMap: Record<number, Record<string, number | null>>) => {
        for (const fee of fees) {
          if (fee.amountUSD && fee.amountUSD !== '0') continue;
          const pricePerUnit = tokenPriceMap[request.fromChain]?.[fee.address] || 0;
          const formattedFeeAmount = formatUnits(BigInt(fee.amount), fee.decimals);
          fee.amountUSD = BigNumber(formattedFeeAmount).multipliedBy(pricePerUnit).toFixed();
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
