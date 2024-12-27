import Decimal from 'decimal.js';
import { formatUnits } from 'viem';

export const calculateAmountUSD = (amountInWei: string, decimals: number, price: string) => {
  return decimals ? Number(new Decimal(formatUnits(BigInt(amountInWei), decimals)).mul(price || 0).toFixed(5)) : 0;
};
