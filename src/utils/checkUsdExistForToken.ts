import { BridgeQuoteRate, SwapQuoteResponseData } from 'src/types';

export const checkUsdExistForToken = (data: BridgeQuoteRate | SwapQuoteResponseData) => {
  if (!data.srcAmountUSD || !data.destAmountUSD) return false;
  return (
    data.fee.gasFee.some((fee) => !fee.amountUSD) ||
    data.fee.providerFee.some((fee) => !fee.amountUSD) ||
    data.fee.protocolFee.some((fee) => !fee.amountUSD)
  );
};
