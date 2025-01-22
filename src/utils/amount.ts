import Decimal from 'decimal.js';
import { BridgeQuoteRate, SwapQuoteResponseData } from 'src/types';
import { formatUnits } from 'viem';

export const calculateAmountUSD = (amountInWei: string, decimals: number, price: number) => {
  return decimals ? new Decimal(formatUnits(BigInt(amountInWei), decimals)).mul(price || 0).toFixed(5) : '0';
};

export const calculateNetGasFeeUsd = (item: SwapQuoteResponseData | BridgeQuoteRate): string => {
  const totalGas = item.fee.gasFee.reduce((acc, fee) => {
    if (!fee.included) {
      const feeAmount = fee.amountUSD || '0';
      return acc.plus(feeAmount);
    }
    return acc;
  }, new Decimal(0));
  return totalGas.toString();
};

export const calculateNetAmount = (item: BridgeQuoteRate | SwapQuoteResponseData) => {
  let feeUSD = new Decimal(calculateNetGasFeeUsd(item));
  item.fee.providerFee.forEach((fee) => {
    if (!fee.included) {
      feeUSD = feeUSD.plus(new Decimal(fee.amountUSD || '0'));
    }
  });
  return new Decimal(item.destAmountUSD || '0').minus(feeUSD).toFixed();
};

export const calculateNetGasFee = (item: SwapQuoteResponseData | BridgeQuoteRate): string => {
  const totalGas = item.fee.gasFee.reduce((acc, fee) => {
    if (!fee.included) {
      const feeAmount = BigInt(fee.amount || '0');
      return acc + feeAmount;
    }
    return acc;
  }, BigInt(0));
  return totalGas.toString();
};
