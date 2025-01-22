import { BridgeQuoteRequest, BridgeQuoteResponse, ChainData } from 'src/types';
import Decimal from 'decimal.js';
import { calculateAmountUSD, calculateNetAmountUsd, updateFee, updatePath } from './amount';
import { PriceService } from 'src/service/price';
import { priceProviders } from 'src/service/price/types/IPriceProvider';

export const updateBridgeQuotes = async (
  quotes: BridgeQuoteResponse,
  request: BridgeQuoteRequest,
  priceService: PriceService,
  chainConfig: ChainData,
): Promise<BridgeQuoteResponse> => {
  const tokensWithoutPrice: Record<number, Set<string>> = {};

  Object.values(quotes).forEach((quote) => {
    if (quote.tokensWithoutPrice) {
      Object.entries(quote.tokensWithoutPrice).forEach(([chainIdStr, tokens]) => {
        const chainId = Number(chainIdStr);

        if (!tokensWithoutPrice[chainId]) {
          tokensWithoutPrice[chainId] = new Set<string>();
        }
        tokens.forEach((token) => tokensWithoutPrice[chainId].add(token));
      });
    }
  });

  if (Object.keys(tokensWithoutPrice).length === 0) {
    return quotes;
  }
  const tokensPrice: Record<number, Record<string, string | null>> = Object.fromEntries(
    await Promise.all(
      Object.entries(tokensWithoutPrice).map(async ([chainIdStr, tokens]) => {
        const chainId = Number(chainIdStr);
        const tokenAddresses = Array.from(tokens);
        const prices = await priceService.getPrices({ chainId, tokenAddresses, chainConfig, notAllowSources: [priceProviders.dZap] });
        return [chainId, prices];
      }),
    ),
  );

  for (const quote of Object.values(quotes)) {
    if (!quote.quoteRates || !Object.keys(quote.quoteRates).length) continue;
    let isSorted = true;
    for (const data of Object.values(quote.quoteRates)) {
      const tokensDetails = request.data.find((d) => d.srcToken === data.srcToken.address && d.destToken === data.destToken.address);
      if (!tokensDetails) {
        continue;
      }
      const { srcDecimals, destDecimals, toChain } = tokensDetails;

      if (!Number(data.srcAmountUSD)) {
        isSorted = false;
        const srcTokenPricePerUnit = tokensPrice[request.fromChain]?.[data.srcToken.address] || '0';
        data.srcAmountUSD = calculateAmountUSD(data.srcAmount, srcDecimals, srcTokenPricePerUnit);
      }

      if (!Number(data.destAmountUSD)) {
        isSorted = false;
        const destTokenPricePerUnit = tokensPrice[toChain]?.[data.destToken.address] || '0';
        data.destAmountUSD = calculateAmountUSD(data.destAmount, destDecimals, destTokenPricePerUnit);
      }

      if (!Number(data.srcAmountUSD) && !Number(data.destAmountUSD)) {
        const priceImpact = new Decimal(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).mul(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }
      const { isUpdated, fee } = updateFee(data.fee, tokensPrice);
      isSorted = !isUpdated;
      data.fee = fee;
      data.path = updatePath(data, tokensPrice);
    }
    if (Object.keys(quote.tokensWithoutPrice).length !== 0 && isSorted === false) {
      quote.quoteRates = Object.fromEntries(
        Object.entries(quote.quoteRates).sort(([, a], [, b]) => {
          const aNetAmount = calculateNetAmountUsd(a);
          const bNetAmount = calculateNetAmountUsd(b);
          return Number(bNetAmount) - Number(aNetAmount);
        }),
      );
      quote.recommendedSource = Object.keys(quote.quoteRates)[0];
    }
  }

  return quotes;
};
