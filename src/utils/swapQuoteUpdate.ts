import { ChainData, FeeDetails, SwapQuoteRequest, SwapQuoteResponse } from 'src/types';
import { zeroAddress } from './tokens';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { PriceService } from 'src/service/price/priceService';
import { checkUsdExistForToken } from './checkUsdExistForToken';

export const swapQuoteUpdate = async (
  quotes: SwapQuoteResponse,
  request: SwapQuoteRequest,
  priceService: PriceService,
  chainConfig: ChainData | null,
): Promise<SwapQuoteResponse> => {
  const tokensWithoutPrice = Object.values(quotes).flatMap((quote) => quote.tokensWithoutPrice) ?? [];

  if (tokensWithoutPrice.length === 0) {
    return quotes;
  }

  const tokensPrice = await priceService.getPriceFromProvider(request.chainId, tokensWithoutPrice, chainConfig);

  for (const quote of Object.values(quotes)) {
    for (const rate of Object.values(quote.quoteRates)) {
      const data = rate.data;
      if (checkUsdExistForToken(data)) {
        break;
      }
      const tokensDetails = request.data.find((d) => d.srcToken === data.srcToken && d.destToken === data.destToken);
      if (!tokensDetails) {
        break;
      }
      const { srcDecimals, destDecimals } = tokensDetails;

      const srcAmount = formatUnits(BigInt(data.srcAmount), srcDecimals);
      const destAmount = formatUnits(BigInt(data.destAmount), destDecimals);

      const srcTokenPricePerUnit = tokensPrice[data.srcToken] || 0;
      const destTokenPricePerUnit = tokensPrice[data.destToken] || 0;

      const calculateAmountUSD = (amount: string | number, pricePerUnit: number) => {
        const amountUSD = BigNumber(amount).multipliedBy(pricePerUnit);
        return +amountUSD ? amountUSD.toFixed() : null;
      };

      data.srcAmountUSD = calculateAmountUSD(srcAmount, srcTokenPricePerUnit);
      data.destAmountUSD = calculateAmountUSD(destAmount, destTokenPricePerUnit);

      if (data.srcAmountUSD && data.destAmountUSD) {
        const priceImpact = BigNumber(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).multipliedBy(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      const updateFeeAmountUSD = (fees: FeeDetails[], tokenPriceMap: Record<string, number | null>) => {
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
        updateFeeAmountUSD(gasFee, tokensPrice);
        updateFeeAmountUSD(protocolFee, tokensPrice);
      }
      updateFeeAmountUSD(providerFee, tokensPrice);
    }
  }

  return quotes;
};
