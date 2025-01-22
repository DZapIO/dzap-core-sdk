import Decimal from 'decimal.js';
import { BridgeQuoteRate, SwapQuoteResponseData } from 'src/types';
import { formatUnits } from 'viem';

export const calculateAmountUSD = (amountInWei: string, decimals: number, price: number) => {
  return decimals ? Number(new Decimal(formatUnits(BigInt(amountInWei), decimals)).mul(price || 0).toFixed(5)) : '0';
};

export const calculateNetAmount = (item: BridgeQuoteRate | SwapQuoteResponseData) => {
  let feeUSD = new Decimal(item.fee.gasFee[0]?.amountUSD || '0');
  item.fee.providerFee.forEach((fee) => {
    if (!fee.included) {
      feeUSD = feeUSD.plus(new Decimal(fee.amountUSD || '0'));
    }
  });
  return new Decimal(item.destAmountUSD || '0').minus(feeUSD).toFixed();
};

export const calculateNetGasFee = (item: SwapQuoteResponseData) => {
  let totalGas = new Decimal(0);
  item.fee.gasFee.forEach((fee) => {
    if (!fee.included) {
      totalGas = totalGas.plus(new Decimal(fee.amount || '0'));
    }
  });
  return totalGas.toFixed(0);
};
