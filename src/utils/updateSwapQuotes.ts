import { ChainData, FeeDetails, SwapQuoteRequest, SwapQuoteResponse } from 'src/types';
import { formatUnits } from 'viem';
import Decimal from 'decimal.js';
import { priceProviders } from 'src/service/price/types/IPriceProvider';
import { PriceService } from 'src/service/price';
import { calculateNetAmount, calculateNetGasFee } from './amount';
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

      if (!Number(data.srcAmountUSD)) {
        data.srcAmountUSD = calculateAmountUSD(srcAmount, srcTokenPricePerUnit);
      }
      if (!Number(data.destAmountUSD)) {
        data.destAmountUSD = calculateAmountUSD(destAmount, destTokenPricePerUnit);
      }

      if (data.srcAmountUSD && Number(data.srcAmountUSD) && data.destAmountUSD && Number(data.destAmountUSD)) {
        const priceImpact = new Decimal(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).mul(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      const updateFeeAmountUSD = (fees: FeeDetails[], tokenPriceMap: Record<string, string | null>) => {
        for (const fee of fees) {
          if (fee.amountUSD && fee.amountUSD !== '0') continue;
          const pricePerUnit = tokenPriceMap[fee.address] || '0';
          fee.amountUSD = new Decimal(formatUnits(BigInt(fee.amount), fee.decimals)).mul(pricePerUnit).toFixed();
        }
      };

      const { gasFee, protocolFee, providerFee } = data.fee;

      updateFeeAmountUSD(gasFee, tokensPrice);
      updateFeeAmountUSD(protocolFee, tokensPrice);

      updateFeeAmountUSD(providerFee, tokensPrice);
    }
    if (quote.tokensWithoutPrice.length !== 0) {
      quote.quoteRates = Object.fromEntries(
        Object.entries(quote.quoteRates).sort(([, a], [, b]) => {
          const aNetAmount = calculateNetAmount(a.data);
          const bNetAmount = calculateNetAmount(b.data);
          return new Decimal(bNetAmount).comparedTo(aNetAmount);
        }),
      );
      const recommendedSourceByGas = Object.keys(quote.quoteRates).sort((a, b) =>
        new Decimal(calculateNetGasFee(quote.quoteRates[b].data)).minus(calculateNetGasFee(quote.quoteRates[a].data)).toNumber(),
      )[0];
      const recommendedSourceByAmount = Object.keys(quote.quoteRates).sort((a, b) =>
        new Decimal(quote.quoteRates[a].data.destAmount).minus(quote.quoteRates[b].data.destAmount).toNumber(),
      )[0];
      quote.recommendedSourceByAmount = recommendedSourceByAmount;
      quote.recommendedSourceByGas = recommendedSourceByGas;
      quote.recommendedSource = Object.keys(quote.quoteRates)[0];
    }
  }

  return quotes;
};
