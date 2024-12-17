import { BridgeQuoteRate, BridgeQuoteRequest, BridgeQuoteResponse, ChainData, Fee, FeeDetails } from 'src/types';
import Decimal from 'decimal.js';
import { calculateAmountUSD } from './amount';
import { PriceService } from 'src/service/price';
import { priceProviders } from 'src/service/price/types/IPriceProvider';
export const updateFee = (fee: Fee, tokensPrice: Record<number, Record<string, number | null>>) => {
  const updateAmountUSD = (feeItem: FeeDetails, chainId: number, address: string, amount: string, decimals: number) => {
    const price = tokensPrice[chainId]?.[address] || 0;
    if (!feeItem.amountUSD || parseFloat(feeItem.amountUSD) === 0) {
      return calculateAmountUSD(amount, decimals, price.toString()).toString();
    }
    return feeItem.amountUSD;
  };

  const updateFeeItems = (feeItems: FeeDetails[]) =>
    feeItems.map((feeItem) => ({
      ...feeItem,
      amountUSD: updateAmountUSD(feeItem, feeItem.chainId, feeItem.address, feeItem.amount, feeItem.decimals),
    }));

  return {
    gasFee: updateFeeItems(fee.gasFee),
    providerFee: updateFeeItems(fee.providerFee),
    protocolFee: updateFeeItems(fee.protocolFee),
  };
};

export const updatePath = (data: BridgeQuoteRate, tokensPrice: Record<number, Record<string, number | null>>) => {
  return data.path.map((path) => {
    return {
      ...path,
      fee: updateFee(path.fee, tokensPrice),
      srcAmountUSD: data.srcAmountUSD,
      destAmountUSD: data.destAmountUSD,
    };
  });
};

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

        const uniqueTokens = tokensWithoutPrice[chainId];
        tokens.forEach((token) => uniqueTokens.add(token));
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
        const tokenAddresses = Array.from(tokens);
        const prices = await priceService.getPrices({ chainId, tokenAddresses, chainConfig, notAllowSources: [priceProviders.dZap] });
        return [chainId, prices];
      }),
    ),
  );

  for (const quote of Object.values(quotes)) {
    if (!quote.quoteRates) continue;

    for (const data of Object.values(quote.quoteRates)) {
      const tokensDetails = request.data.find((d) => d.srcToken === data.srcToken.address && d.destToken === data.destToken.address);
      if (!tokensDetails) {
        continue;
      }
      const { srcDecimals, destDecimals, toChain } = tokensDetails;

      const srcTokenPricePerUnit = tokensPrice[request.fromChain]?.[data.srcToken.address] || 0;
      const destTokenPricePerUnit = tokensPrice[toChain]?.[data.destToken.address] || 0;

      data.srcAmountUSD = calculateAmountUSD(data.srcAmount, srcDecimals, srcTokenPricePerUnit.toString()).toString();
      data.destAmountUSD = calculateAmountUSD(data.destAmount, destDecimals, destTokenPricePerUnit.toString()).toString();

      if (data.srcAmountUSD && data.destAmountUSD) {
        const priceImpact = new Decimal(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).mul(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      data.fee = updateFee(data.fee, tokensPrice);
      data.path = updatePath(data, tokensPrice);
    }
  }

  return quotes;
};
