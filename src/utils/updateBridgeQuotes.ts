import { BridgeQuoteRate, BridgeQuoteRequest, BridgeQuoteResponse, ChainData, Fee } from 'src/types';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { PriceService } from 'src/service/price/priceService';
import { nativeTokens } from './tokens';
import { checkUsdExistForToken } from './checkUsdExistForToken';
import { calculateAmountUSD } from '.';

export const updateFee = (fee: Fee, tokensPrice: Record<number, Record<string, number | null>>, hasNativeToken: boolean) => {
  const updateAmountUSD = (feeItem: any, chainId: number, address: string, amount: string, decimals: number) => {
    const price = tokensPrice[chainId]?.[address] || 0;
    if (feeItem.amountUSD && feeItem.amountUSD !== '0') {
      return calculateAmountUSD(amount, decimals, price.toString()).toString();
    }
    return feeItem.amountUSD;
  };

  const updateFeeItems = (feeItems: any[]) =>
    feeItems.map((feeItem) => ({
      ...feeItem,
      amountUSD: updateAmountUSD(feeItem, feeItem.chainId, feeItem.address, feeItem.amount, feeItem.decimals),
    }));

  return {
    gasFee: hasNativeToken ? updateFeeItems(fee.gasFee) : fee.gasFee,
    providerFee: updateFeeItems(fee.providerFee),
    protocolFee: updateFeeItems(fee.protocolFee),
  };
};

export const updatePath = (data: BridgeQuoteRate, tokensPrice: Record<number, Record<string, number | null>>, hasNativeToken: boolean) => {
  return data.path.map((path) => {
    return {
      ...path,
      fee: updateFee(path.fee, tokensPrice, hasNativeToken),
      srcAmountUSD: data.srcAmountUSD,
      destAmountUSD: data.destAmountUSD,
    };
  });
};

export const updateBridgeQuotes = async (
  quotes: BridgeQuoteResponse,
  request: BridgeQuoteRequest,
  priceService: PriceService,
  chainConfig: ChainData | null,
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
        const prices = await priceService.getPriceFromProvider(chainId, tokenAddresses, chainConfig);
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

      data.srcAmountUSD = calculateAmountUSD(srcAmount, srcDecimals, srcTokenPricePerUnit.toString()).toString();
      data.destAmountUSD = calculateAmountUSD(destAmount, destDecimals, destTokenPricePerUnit.toString()).toString();

      if (data.srcAmountUSD && data.destAmountUSD) {
        const priceImpact = BigNumber(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).multipliedBy(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }

      if (data.srcAmountUSD && data.destAmountUSD) {
        const priceImpact = BigNumber(data.destAmountUSD).minus(data.srcAmountUSD).div(data.srcAmountUSD).multipliedBy(100);
        data.priceImpactPercent = priceImpact.toFixed(2);
      }
      const hasNativeToken = nativeTokens.some((token) => tokensWithoutPrice[request.fromChain]?.has(token));

      data.fee = updateFee(data.fee, tokensPrice, hasNativeToken);
      data.path = updatePath(data, tokensPrice, hasNativeToken);
    }
  }

  return quotes;
};
