import Decimal from 'decimal.js';
import { BridgeQuoteRate, Fee, FeeDetails, SwapQuoteResponseData } from 'src/types';
import { formatUnits } from 'viem';

export const calculateAmountUSD = (amountInWei: string, decimals: number, price: string) => {
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
  return totalGas.toFixed(5);
};

export const calculateNetAmountUsd = (item: BridgeQuoteRate | SwapQuoteResponseData) => {
  let feeUSD = new Decimal(calculateNetGasFeeUsd(item));
  item.fee.providerFee.forEach((fee) => {
    if (!fee.included) {
      feeUSD = feeUSD.plus(new Decimal(fee.amountUSD || '0'));
    }
  });
  return new Decimal(item.destAmountUSD || '0').minus(feeUSD).toFixed(5);
};

export const compareAmount = (sourceAmount: string | number, destAmount: string | number) => {
  return new Decimal(sourceAmount).comparedTo(destAmount);
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

export const updateFee = (fee: Fee, tokensPrice: Record<number, Record<string, string | null>>) => {
  let isUpdated = false;
  const updateAmountUSD = (feeItem: FeeDetails, chainId: number, address: string, amount: string, decimals: number) => {
    const price = tokensPrice[chainId]?.[address] || '0';
    if (!feeItem.amountUSD || parseFloat(feeItem.amountUSD) === 0) {
      isUpdated = feeItem.included;
      return calculateAmountUSD(amount, decimals, price);
    }
    return feeItem.amountUSD;
  };

  const updateFeeItems = (feeItems: FeeDetails[]) =>
    feeItems.map((feeItem) => ({
      ...feeItem,
      amountUSD: updateAmountUSD(feeItem, feeItem.chainId, feeItem.address, feeItem.amount, feeItem.decimals),
    }));

  return {
    isUpdated: isUpdated,
    fee: {
      gasFee: updateFeeItems(fee.gasFee),
      providerFee: updateFeeItems(fee.providerFee),
      protocolFee: updateFeeItems(fee.protocolFee),
    },
  };
};

export const updatePath = (data: BridgeQuoteRate, tokensPrice: Record<number, Record<string, string | null>>) => {
  return data.path.map((path) => {
    const { fee } = updateFee(path.fee, tokensPrice);
    return {
      ...path,
      fee,
      srcAmountUSD: data.srcAmountUSD,
      destAmountUSD: data.destAmountUSD,
    };
  });
};
