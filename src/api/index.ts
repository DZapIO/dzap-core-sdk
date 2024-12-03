import { CancelToken } from 'axios';
import { Signer } from 'ethers';
import { GET, POST } from 'src/constants/httpMethods';
import {
  BATCH_SWAP_BUILD_TX_URL,
  BATCH_SWAP_QUOTE_URL,
  BRIDGE_BUILD_TX_URL,
  BRIDGE_QUOTE_URL,
  CALCULATE_POINTS_URL,
  GET_ALL_CHAINS_URL,
  GET_ALL_TOKENS_URL,
  GET_TOKEN_DETAILS_URL,
  GET_TOKEN_PRICE,
} from 'src/constants/urlConstants';
import { invoke } from 'src/utils/axios';
import { BridgeParamsRequest, BridgeQuoteRequest, CalculatePointsRequest, SwapParamsRequest, SwapQuoteRequest } from '../types';

export const fetchQuoteRate = (request: SwapQuoteRequest, cancelToken: CancelToken) =>
  invoke({
    endpoint: BATCH_SWAP_QUOTE_URL,
    data: request,
    method: POST,
    cancelToken,
    shouldRetry: true,
  });

export const fetchBridgeQuoteRate = (request: BridgeQuoteRequest, cancelToken: CancelToken) =>
  invoke({
    endpoint: BRIDGE_QUOTE_URL,
    data: request,
    method: POST,
    cancelToken,
    shouldRetry: true,
  });

export const buildBridgeTransaction = (request: BridgeParamsRequest) =>
  invoke({
    endpoint: BRIDGE_BUILD_TX_URL,
    data: request,
    method: POST,
  });

export const buildSwapTransaction = (request: SwapParamsRequest) =>
  invoke({
    endpoint: BATCH_SWAP_BUILD_TX_URL,
    data: request,
  });

export const fetchAllSupportedChains = () =>
  invoke({
    endpoint: GET_ALL_CHAINS_URL,
    data: {},
    method: GET,
    shouldRetry: true,
  });

export const fetchAllTokens = (chainId: number, source?: string, account?: string) =>
  invoke({
    endpoint: GET_ALL_TOKENS_URL,
    data: { chainId, source, account },
    method: GET,
    shouldRetry: true,
  });

export const fetchTokenDetails = (tokenAddress: string, chainId: number, account?: string) =>
  invoke({
    endpoint: GET_TOKEN_DETAILS_URL,
    data: { tokenAddress, chainId, account },
    method: GET,
  });

export const fetchTokenPrice = (tokenAddresses: string[], chainId: number) =>
  invoke({
    endpoint: GET_TOKEN_PRICE,
    data: { tokenAddresses, chainId },
    method: GET,
  });

export const fetchCalculatedPoints = (request: CalculatePointsRequest) =>
  invoke({
    endpoint: CALCULATE_POINTS_URL,
    data: request,
    method: POST,
  });

export const swapTokensApi = async ({ request, provider }: { request: SwapParamsRequest; provider: Signer }) => {
  try {
    const { data: paramResponseData } = await buildSwapTransaction(request);
    const {
      transactionRequest: { data, from, to, value, gasLimit },
    } = paramResponseData;

    // Add gasPrice: fast, medium, slow
    return await provider.sendTransaction({
      from,
      to,
      data,
      value,
      gasLimit,
    });
  } catch (err: any) {
    throw new Error(err);
  }
};
