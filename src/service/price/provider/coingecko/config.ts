export const coingeckoConfig = {
  urls: {
    nativeTokenPrice: (chainKey: string) =>
      `https://api.coingecko.com/api/v3/simple/price?ids=${chainKey}&vs_currencies=usd&include_last_updated_at=true`,

    ecr20TokenPrice: (contractAddress: string, chainKey: string) =>
      `https://api.coingecko.com/api/v3/simple/token_price/${chainKey}?contract_addresses=${contractAddress}&vs_currencies=usd&include_last_updated_at=true`,
  },
};
