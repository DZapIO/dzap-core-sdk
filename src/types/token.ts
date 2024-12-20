export type TokenInfo = {
  contract: string;
  name: string;
  chainId: number;
  symbol: string;
  balance: string;
  decimals: number;
  price: string | number | null;
  balanceInUsd?: number | null;
  coinKey?: string | null;
  logo?: string;
  verified?: boolean;
  network?: string;
};
export type TokenResponse = {
  [key: string]: TokenInfo;
};
