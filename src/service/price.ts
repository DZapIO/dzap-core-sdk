import { fetchTokenPrice } from 'src/api';
import DzapClient from 'src/client';
import { dZapNativeTokenFormat } from 'src/constants';
import { GET } from 'src/constants/httpMethods';
import { isNativeCurrency } from 'src/utils';
import { invoke } from 'src/utils/axios';

const fetchNativePrice = async (chainId: number): Promise<number> => {
  const chainConfig = await DzapClient.getChainConfig();
  const { coingecko } = chainConfig[chainId];
  if (!coingecko) return 0;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingecko?.nativeTokenKey}&vs_currencies=usd&include_last_updated_at=true`;

  const response = await invoke({ endpoint: url, method: GET });
  return response.data[coingecko?.nativeTokenKey]?.usd || 0;
};

const fetchERC20Prices = async (chainId: number, addresses: string[]): Promise<Record<string, number>> => {
  if (!addresses.length) return {};

  const chainConfig = await DzapClient.getChainConfig();
  const { coingecko } = chainConfig[chainId];
  if (!coingecko) return {};
  const requests = addresses.map((address) => {
    const url = `https://api.coingecko.com/api/v3/simple/token_price/${coingecko?.chainKey}?contract_addresses=${address}&vs_currencies=usd&include_last_updated_at=true`;
    return invoke({ endpoint: url, method: GET });
  });

  const responses = await Promise.all(requests);
  return responses.reduce(
    (acc, response, index) => {
      const priceData = response.data[addresses[index]];
      if (priceData) acc[addresses[index]] = priceData.usd;
      return acc;
    },
    {} as Record<string, number>,
  );
};

const getPriceFromCoingecko = async (tokenAddresses: string[], chainId: number) => {
  const addressesWithoutNativeToken = tokenAddresses.filter((address) => !isNativeCurrency(address));

  const [erc20Prices, nativePrice] = await Promise.all([
    fetchERC20Prices(chainId, addressesWithoutNativeToken),
    addressesWithoutNativeToken.length !== tokenAddresses.length ? fetchNativePrice(chainId) : undefined,
  ]);

  if (nativePrice) {
    erc20Prices[dZapNativeTokenFormat] = nativePrice;
  }
  console.log(nativePrice, erc20Prices);
  return Object.fromEntries(tokenAddresses.map((address) => [address, erc20Prices[address.toLowerCase()] || null]));
};

const getPriceFromProvider = async (chainId: number, tokenAddresses: string[]): Promise<Record<string, number | null>> => {
  return getPriceFromCoingecko(tokenAddresses, chainId);
};

export const getPriceForToken = async (chainId: number, tokenAddress: string): Promise<string> => {
  try {
    const tokenPrices = await fetchTokenPrice([tokenAddress], chainId);
    return tokenPrices[tokenAddress] || (await getPriceFromProvider(chainId, [tokenAddress]))[tokenAddress]?.toString() || '0';
  } catch {
    return '0';
  }
};

export const getPriceForTokens = async (chainId: number, tokenAddresses: string[]): Promise<Record<string, string | null>> => {
  try {
    const tokenPrices = await fetchTokenPrice(tokenAddresses, chainId);

    const missingTokens = tokenAddresses.filter((address) => !tokenPrices[address]);

    console.log('missingTokens', missingTokens);

    const fetchedPrices = await getPriceFromProvider(chainId, missingTokens);
    console.log('fetchedPrices', fetchedPrices);
    return tokenAddresses.reduce(
      (acc, address) => {
        acc[address] = tokenPrices[address] || fetchedPrices[address]?.toString() || '0';
        return acc;
      },
      {} as Record<string, string | null>,
    );
  } catch (error) {
    return tokenAddresses.reduce(
      (acc, address) => {
        acc[address] = '0';
        return acc;
      },
      {} as Record<string, string | null>,
    );
  }
};
