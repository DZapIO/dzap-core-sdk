import { BridgeQuoteRate, SwapQuoteResponseData } from 'src/types';

export const isUSDPriceAvailableForQuotes = (data: BridgeQuoteRate | SwapQuoteResponseData): boolean => {
  if (!data.srcAmountUSD || !data.destAmountUSD) return false;
  if ('path' in data) {
    for (const path of data.path) {
      if (!path.srcAmountUSD || !path.destAmountUSD) return false;

      const isPathFeeMissing = [...(data.fee.gasFee || []), ...(data.fee.providerFee || []), ...(data.fee.protocolFee || [])].some(
        (fee) => !fee.amountUSD,
      );

      if (isPathFeeMissing) return false;
    }
  }

  const isFeeMissing = [...(data.fee.gasFee || []), ...(data.fee.providerFee || []), ...(data.fee.protocolFee || [])].some((fee) => !fee.amountUSD);

  return !isFeeMissing;
};
