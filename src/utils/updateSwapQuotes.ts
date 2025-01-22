import { ChainData, SwapQuoteRequest, SwapQuoteResponse } from 'src/types';
import { formatUnits } from 'viem';
import Decimal from 'decimal.js';
import { priceProviders } from 'src/service/price/types/IPriceProvider';
import { PriceService } from 'src/service/price';
import { calculateNetAmountUsd, calculateNetGasFee, compareAmount, updateFee } from './amount';

export const updateSwapQuotes = async (
  quotes: SwapQuoteResponse,
  request: SwapQuoteRequest,
  priceService: PriceService,
  chainConfig: ChainData,
): Promise<SwapQuoteResponse> => {
  const tokensWithoutPrice = Object.values(quotes).flatMap((quote) => quote.tokensWithoutPrice) ?? [];

  if (tokensWithoutPrice.length === 0) {
    return quotes;
  }

  const tokensPrice = await priceService.getPrices({
    chainId: request.chainId,
    tokenAddresses: tokensWithoutPrice,
    chainConfig,
    notAllowSources: [priceProviders.dZap],
  });

  for (const quote of Object.values(quotes)) {
    let isSorted = true;
    for (const rate of Object.values(quote.quoteRates)) {
      const data = rate.data;
      const tokensDetails = request.data.find((d) => d.srcToken === data.srcToken && d.destToken === data.destToken);
      if (!tokensDetails) {
        continue;
      }
      const { srcDecimals, destDecimals } = tokensDetails;

      const srcAmount = formatUnits(BigInt(data.srcAmount), srcDecimals);
      const destAmount = formatUnits(BigInt(data.destAmount), destDecimals);

      const srcTokenPricePerUnit = tokensPrice[data.srcToken] || '0';
      const destTokenPricePerUnit = tokensPrice[data.destToken] || '0';

      const calculateAmountUSD = (amount: string | number, pricePerUnit: string) => {
        const amountUSD = new Decimal(amount).mul(pricePerUnit);
        return +amountUSD ? amountUSD.toFixed() : null;
      };

      if (data.srcAmountUSD && !compareAmount(data.srcAmountUSD, '0')) {
        isSorted = false;
        data.srcAmountUSD = calculateAmountUSD(srcAmount, srcTokenPricePerUnit);
      }
      if (data.destAmountUSD && !compareAmount(data.destAmountUSD, '0')) {
        isSorted = false;
        data.destAmountUSD = calculateAmountUSD(destAmount, destTokenPricePerUnit);
      }

      if (data.srcAmountUSD && !compareAmount(data.srcAmountUSD, '0') && data.destAmountUSD && !compareAmount(data.destAmountUSD, '0')) {
        const priceImpact = new Decimal(data.destAmountUSD || 0)
          .minus(data.srcAmountUSD || 0)
          .div(data.srcAmountUSD || 0)
          .mul(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      const { fee, isUpdated } = updateFee(data.fee, {
        [request.chainId]: tokensPrice,
      });
      data.fee = fee;
      isSorted = !isUpdated;
    }
    if (quote.tokensWithoutPrice.length !== 0 || isSorted == false) {
      quote.quoteRates = Object.fromEntries(
        Object.entries(quote.quoteRates).sort(([, a], [, b]) => {
          const aNetAmount = calculateNetAmountUsd(a.data);
          const bNetAmount = calculateNetAmountUsd(b.data);
          return new Decimal(bNetAmount).comparedTo(aNetAmount);
        }),
      );
      const recommendedSourceByGas = Object.keys(quote.quoteRates).sort((a, b) =>
        new Decimal(calculateNetGasFee(quote.quoteRates[b].data)).comparedTo(calculateNetGasFee(quote.quoteRates[a].data)),
      )[0];
      const recommendedSourceByAmount = Object.keys(quote.quoteRates).sort((a, b) =>
        new Decimal(quote.quoteRates[a].data.destAmount).comparedTo(quote.quoteRates[b].data.destAmount),
      )[0];
      quote.recommendedSourceByAmount = recommendedSourceByAmount;
      quote.recommendedSourceByGas = recommendedSourceByGas;
      quote.recommendedSource = Object.keys(quote.quoteRates)[0];
    }
  }

  return quotes;
};
