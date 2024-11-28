import { ChainData, FeeDetails, SwapQuoteRequest, SwapQuoteResponse } from 'src/types';
import { zeroAddress } from './tokens';
import { getDecimals } from './getDecimals';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { PriceService } from 'src/service/price/priceService';

export const swapQuoteUpdate = async (
  quotes: SwapQuoteResponse,
  request: SwapQuoteRequest,
  priceService: PriceService,
  chainConfig: ChainData | null,
): Promise<SwapQuoteResponse> => {
  const tokensWithoutPrice = Object.values(quotes)[0]?.tokensWithoutPrice ?? [];

  if (tokensWithoutPrice.length === 0) {
    return quotes;
  }

  const tokensPrice = await priceService.getPriceFromProvider(request.chainId, tokensWithoutPrice, chainConfig);

  for (const quote of Object.values(quotes)) {
    for (const rate of Object.values(quote.quoteRates)) {
      const data = rate.data;

      if (data.srcAmountUSD && data.destAmountUSD) {
        break;
      }

      const tokensDecimal = getDecimals(request, data.srcToken, data.destToken);
      if (!tokensDecimal) {
        break;
      }

      const { srcDecimals, destDecimals } = tokensDecimal;

      const srcAmount = formatUnits(BigInt(data.srcAmount), srcDecimals);
      const destAmount = formatUnits(BigInt(data.destAmount), destDecimals);

      const srcTokenPricePerUnit = tokensPrice[data.srcToken] || '0';
      const destTokenPricePerUnit = tokensPrice[data.destToken] || '0';

      const srcAmountUSD = BigNumber(srcAmount).multipliedBy(srcTokenPricePerUnit);
      const destAmountUSD = BigNumber(destAmount).multipliedBy(destTokenPricePerUnit);

      data.srcAmountUSD = +srcAmountUSD ? srcAmountUSD.toFixed() : null;
      data.destAmountUSD = +destAmountUSD ? destAmountUSD.toFixed() : null;

      if (srcAmountUSD && destAmountUSD) {
        const priceImpact = destAmountUSD.minus(srcAmountUSD).div(srcAmountUSD).multipliedBy(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      const updateFeeAmountUSD = async (fees: FeeDetails[], tokenPriceMap: Record<string, number | null>) => {
        for (const fee of fees) {
          if (fee.amountUSD && fee.amountUSD !== '0') continue;
          const pricePerUnit = tokenPriceMap[fee.address] || '0';
          fee.amountUSD = BigNumber(formatUnits(BigInt(fee.amount), fee.decimals))
            .multipliedBy(pricePerUnit)
            .toFixed();
        }
      };

      const { gasFee, protocolFee, providerFee } = data.fee;
      if (tokensWithoutPrice.includes(zeroAddress)) {
        await Promise.all([updateFeeAmountUSD(gasFee, tokensPrice), updateFeeAmountUSD(protocolFee, tokensPrice)]);
      }
      updateFeeAmountUSD(providerFee, tokensPrice);
    }
  }

  return quotes;
};
