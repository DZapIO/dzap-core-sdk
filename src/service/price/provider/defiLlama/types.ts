export type DefiLlamaCoin = {
  price: number;
  symbol: string;
  timestamp: number;
  confidence: number;
};

export type DefiLlamaResponse = {
  coins: { [key: string]: DefiLlamaCoin };
};
