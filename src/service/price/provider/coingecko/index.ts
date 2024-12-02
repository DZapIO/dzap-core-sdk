import { GET } from 'src/constants/httpMethods';
import { ChainData } from 'src/types';
import { invoke } from 'src/utils/axios';
import { coingeckoConfig } from './config';
import { isNativeCurrency } from 'src/utils';
import { getDZapNativeTokenByChainId } from 'src/utils/tokens';

export class CoingeckoPriceProvider {
  private fetchNativePrice = async (chainId: number, chainConfig: ChainData | null): Promise<number> => {
    if (!chainConfig) return 0;
    const { coingecko } = chainConfig[chainId];
    if (!coingecko) return 0;
    const response: Record<string, { usd: number }> = await invoke({
      endpoint: coingeckoConfig.urls.nativeTokenPrice(coingecko?.nativeTokenKey),
      method: GET,
    });

    return response[coingecko?.nativeTokenKey]?.usd || 0;
  };

  private fetchERC20Prices = async (chainId: number, addresses: string[], chainConfig: ChainData | null): Promise<Record<string, number>> => {
    if (!addresses.length || !chainConfig) return {};

    const { coingecko } = chainConfig[chainId];
    if (!coingecko) return {};

    const requests = addresses.map((address) => invoke({ endpoint: coingeckoConfig.urls.ecr20TokenPrice(address, coingecko.chainKey), method: GET }));

    const responses = (await Promise.all(requests)) as Record<string, { usd: number }>[];

    return responses.reduce<Record<string, number>>((acc, response, index) => {
      acc[addresses[index]] = response[addresses[index].toLowerCase()]?.usd || 0;
      return acc;
    }, {});
  };
  public getPriceFromCoingecko = async (tokenAddresses: string[], chainId: number, chainConfig: ChainData | null) => {
    try {
      const addressesWithoutNativeToken = tokenAddresses.filter((address) => !isNativeCurrency(address));
      const [erc20Prices, nativePrice] = await Promise.all([
        this.fetchERC20Prices(chainId, addressesWithoutNativeToken, chainConfig),
        addressesWithoutNativeToken.length !== tokenAddresses.length ? this.fetchNativePrice(chainId, chainConfig) : undefined,
      ]);

      console.log({ erc20Prices, nativePrice });
      if (nativePrice) {
        erc20Prices[getDZapNativeTokenByChainId(chainId)] = nativePrice;
      }

      return erc20Prices;
    } catch (e) {
      return {};
    }
  };
}
