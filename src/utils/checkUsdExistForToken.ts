import { BridgeQuoteRate, SwapQuoteResponseData } from 'src/types';

export const checkUsdExistForToken = (data: BridgeQuoteRate | SwapQuoteResponseData) => {
  if (!data.srcAmountUSD || !data.destAmountUSD) return false;
  //dev: Gas fee and protocol fee is in same token if one exist then other should
  return data.fee.gasFee.some((fee) => !fee.amountUSD) || data.fee.providerFee.some((fee) => !fee.amountUSD);
};
