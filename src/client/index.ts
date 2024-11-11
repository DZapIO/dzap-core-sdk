import {
  AvailableDZapServices,
  BridgeParamsRequest,
  BridgeParamsRequestData,
  BridgeParamsResponse,
  BridgeQuoteRequest,
  BridgeQuoteResponse,
  CalculatePointsRequest,
  Chain,
  ChainData,
  HexString,
  OtherAvailableAbis,
  SwapData,
  SwapParamsRequest,
  SwapQuoteRequest,
} from 'src/types';
import Axios, { CancelTokenSource } from 'axios';
import { StatusCodes, TxnStatus } from 'src/enums';
import { TransactionReceipt, WalletClient } from 'viem';
import {
  buildBridgeTransaction,
  buildSwapTransaction,
  fetchCalculatedPoints,
  fetchAllSupportedChains,
  fetchAllTokens,
  fetchBridgeQuoteRate,
  fetchQuoteRate,
  fetchTokenDetails,
  swapTokensApi,
} from '../api';
import { getDZapAbi, getOtherAbis, handleDecodeTrxData } from 'src/utils';

import ContractHandler from 'src/contractHandler';
import PermitHandler from 'src/contractHandler/permitHandler';
import { Signer } from 'ethers';
import { getPriceForTokens } from 'src/service/price';

class DzapClient {
  private static instance: DzapClient;
  private cancelTokenSource: CancelTokenSource | null = null;
  private contractHandler: ContractHandler;
  private permitHandler: PermitHandler;
  private static chainConfig: ChainData | null = null;

  private constructor() {
    this.contractHandler = ContractHandler.getInstance();
    this.permitHandler = PermitHandler.getInstance();
  }

  // Static method to control the access to the singleton instance.
  public static getInstance(): DzapClient {
    if (!DzapClient.instance) {
      DzapClient.instance = new DzapClient();
    }
    return DzapClient.instance;
  }

  public static async getChainConfig(): Promise<ChainData> {
    if (!DzapClient.chainConfig) {
      const data = await fetchAllSupportedChains();
      const chains: ChainData = {};
      data.forEach((chain: Chain) => {
        if (!chains[chain.chainId]) {
          chains[chain.chainId] = chain;
        }
      });
      DzapClient.chainConfig = chains;
    }
    return DzapClient.chainConfig;
  }

  public static getDZapAbi(service: AvailableDZapServices) {
    return getDZapAbi(service);
  }
  public static getOtherAbi = (name: OtherAvailableAbis) => {
    return getOtherAbis(name);
  };

  public async getQuoteRate(request: SwapQuoteRequest) {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Cancelled due to new request');
    }

    this.cancelTokenSource = Axios.CancelToken.source();
    return await fetchQuoteRate(request, this.cancelTokenSource.token);
  }

  public async getBridgeQuoteRate(request: BridgeQuoteRequest): Promise<BridgeQuoteResponse> {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Cancelled due to new request');
    }
    this.cancelTokenSource = Axios.CancelToken.source();
    return await fetchBridgeQuoteRate(request, this.cancelTokenSource.token);
  }

  public async getBridgeParams(request: BridgeParamsRequest): Promise<BridgeParamsResponse> {
    return await buildBridgeTransaction(request);
  }

  public getSwapParams(request: SwapParamsRequest) {
    return buildSwapTransaction(request);
  }

  public getAllSupportedChains(): Promise<ChainData> {
    return fetchAllSupportedChains();
  }

  public async getAllTokens(chainId: number, source?: string, account?: string) {
    return await fetchAllTokens(chainId, source, account);
  }

  public async getTokenDetails(tokenAddress: string, chainId: number, account?: string) {
    return await fetchTokenDetails(tokenAddress, chainId, account);
  }

  public async getTokenPrice(tokenAddresses: string[], chainId: number): Promise<Record<string, string | null>> {
    return await getPriceForTokens(chainId, tokenAddresses);
  }

  public swapTokens = ({ request, provider }: { request: SwapParamsRequest; provider: Signer }) => {
    return swapTokensApi({ request, provider });
  };

  public async swap({ chainId, request, signer }: { chainId: number; request: SwapParamsRequest; signer: Signer | WalletClient }) {
    return await this.contractHandler.handleSwap({ chainId, request, signer });
  }

  public async bridge({ chainId, request, signer }: { chainId: number; request: BridgeParamsRequest; signer: Signer | WalletClient }) {
    return await this.contractHandler.handleBridge({ chainId, request, signer });
  }

  public decodeTrxData({ data, service }: { data: TransactionReceipt; service: AvailableDZapServices }) {
    return handleDecodeTrxData(data, service);
  }

  public async calculatePoints(request: CalculatePointsRequest): Promise<{ points: number }> {
    return await fetchCalculatedPoints(request);
  }

  public getDZapContractAddress = ({ chainId, service }: { chainId: number; service: AvailableDZapServices }) => {
    return this.contractHandler.getDZapContractAddress({ chainId, service });
  };

  public async allowance({
    chainId,
    sender,
    data,
    rpcUrls,
  }: {
    chainId: number;
    sender: HexString;
    data: { srcToken: HexString; amount: bigint }[];
    rpcUrls: string[];
  }) {
    return await this.permitHandler.handleGetAllowance({
      chainId,
      sender,
      data,
      rpcUrls,
    });
  }

  public async approve({
    chainId,
    signer,
    sender,
    rpcUrls,
    data,
    approvalTxnCallback,
  }: {
    chainId: number;
    signer: WalletClient;
    sender: HexString;
    rpcUrls?: string[];
    data: { srcToken: HexString; amountToApprove: bigint }[];
    approvalTxnCallback?: ({
      txnDetails,
      address,
    }: {
      txnDetails: { txnHash: string; code: StatusCodes; status: TxnStatus };
      address: HexString;
    }) => Promise<TxnStatus | void>;
  }) {
    return await this.permitHandler.handleApprove({
      chainId,
      signer,
      sender,
      rpcUrls,
      data,
      approvalTxnCallback,
    });
  }

  public async sign({
    chainId,
    sender,
    data,
    rpcUrls,
    signer,
    service,
    signatureCallback,
  }: {
    chainId: number;
    sender: string;
    data: SwapData[] | BridgeParamsRequestData[];
    rpcUrls?: string[];
    service: AvailableDZapServices;
    signer: WalletClient;
    signatureCallback?: ({ permitData, srcToken, amount }: { permitData: HexString; srcToken: string; amount: bigint }) => Promise<void>;
  }) {
    return await this.permitHandler.handleSign({
      chainId,
      sender,
      data,
      rpcUrls,
      signer,
      service,
      signatureCallback,
    });
  }
}

export default DzapClient;
