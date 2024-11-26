import Axios, { CancelTokenSource } from 'axios';
import { StatusCodes, TxnStatus } from 'src/enums';
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
  SwapParamsResponse,
  SwapQuoteRequest,
  SwapQuoteResponse,
} from 'src/types';
import { getDZapAbi, getOtherAbis, handleDecodeTrxData } from 'src/utils';
import { formatUnits, TransactionReceipt, WalletClient } from 'viem';
import {
  buildBridgeTransaction,
  buildSwapTransaction,
  fetchAllSupportedChains,
  fetchAllTokens,
  fetchBridgeQuoteRate,
  fetchCalculatedPoints,
  fetchQuoteRate,
  fetchTokenDetails,
  swapTokensApi,
} from '../api';
import ContractHandler from 'src/contractHandler';
import PermitHandler from 'src/contractHandler/permitHandler';
import { Signer } from 'ethers';
import { PriceService } from 'src/service/price/priceService';
import { zeroAddress } from 'src/utils/tokens';
import BigNumber from 'bignumber.js';
import { getDecimals } from 'src/utils/getDecimals';

class DzapClient {
  private static instance: DzapClient;
  private cancelTokenSource: CancelTokenSource | null = null;
  private contractHandler: ContractHandler;
  private permitHandler: PermitHandler;
  private static chainConfig: ChainData | null = null;
  private priceService;
  private constructor() {
    this.contractHandler = ContractHandler.getInstance();
    this.permitHandler = PermitHandler.getInstance();
    this.priceService = new PriceService();
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

  public async getQuoteRate(request: SwapQuoteRequest): Promise<SwapQuoteResponse> {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Cancelled due to new request');
    }
    this.cancelTokenSource = Axios.CancelToken.source();

    const quotes: SwapQuoteResponse = await fetchQuoteRate(request, this.cancelTokenSource.token);

    const tokenSet = new Set<string>();
    Object.keys(quotes).forEach((key) => {
      const [token1, token2] = key.split('-');
      tokenSet.add(token1);
      tokenSet.add(token2);
      tokenSet.add(zeroAddress);
    });

    const tokenList = Array.from(tokenSet);
    const tokensPrice = await this.getTokenPrice(tokenList, request.chainId);

    Object.values(quotes).map((quote) => {
      Object.values(quote.quoteRates).map((rate) => {
        const data = rate.data;
        if (data.srcAmountUSD && data.destAmountUSD) return;

        const tokensDecimal = getDecimals(request, data.srcToken, data.destToken);

        if (!tokensDecimal) return;
        const srcTokenPricePerUnit = tokensPrice[data.srcToken] || '0';
        const destTokenPricePerUnit = tokensPrice[data.destToken] || '0';

        const srcAmount = formatUnits(BigInt(data.srcAmount), tokensDecimal.srcDecimals);
        const destAmount = formatUnits(BigInt(data.destAmount), tokensDecimal.destDecimals);

        const srcAmountUSD = BigNumber(srcAmount).multipliedBy(srcTokenPricePerUnit);
        const destAmountUSD = BigNumber(destAmount).multipliedBy(destTokenPricePerUnit);

        data.srcAmountUSD = +srcAmountUSD ? srcAmountUSD.toFixed() : null;
        data.destAmountUSD = +destAmountUSD ? destAmountUSD.toFixed() : null;

        // Optionally calculate and update price impact
        if (+srcAmountUSD && +destAmountUSD) {
          const priceImpact = destAmountUSD.minus(srcAmountUSD).div(srcAmountUSD).multipliedBy(100);
          data.priceImpactPercent = priceImpact.toFixed(2);
        }

        data.fee.gasFee.map(async (fee) => {
          if (fee.amountUSD && fee.amountUSD !== '0') return;
          const pricePerUnit = tokensPrice[fee.address] || (await this.getTokenPrice([fee.address], request.chainId))[fee.address] || '0';
          fee.amountUSD = BigNumber(formatUnits(BigInt(fee.amount), fee.decimals))
            .multipliedBy(pricePerUnit)
            .toFixed();
        });

        data.fee.protocolFee.map(async (fee) => {
          if (fee.amountUSD && fee.amountUSD !== '0') return;
          const pricePerUnit = tokensPrice[fee.address] || (await this.getTokenPrice([fee.address], request.chainId))[fee.address] || '0';
          fee.amountUSD = BigNumber(formatUnits(BigInt(fee.amount), fee.decimals))
            .multipliedBy(pricePerUnit)
            .toFixed();
        });

        data.fee.providerFee.map(async (fee) => {
          if (fee.amountUSD && fee.amountUSD !== '0') return;
          const pricePerUnit = tokensPrice[fee.address] || (await this.getTokenPrice([fee.address], request.chainId))[fee.address] || '0';
          fee.amountUSD = BigNumber(formatUnits(BigInt(fee.amount), fee.decimals))
            .multipliedBy(pricePerUnit)
            .toFixed();
        });
      });
    });

    return quotes;
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
    return await this.priceService.getPriceForTokens(chainId, tokenAddresses, await DzapClient.getChainConfig());
  }

  public swapTokens = ({ request, provider }: { request: SwapParamsRequest; provider: Signer }) => {
    return swapTokensApi({ request, provider });
  };

  public async swap({
    chainId,
    request,
    signer,
    txnData,
  }: {
    chainId: number;
    request: SwapParamsRequest;
    signer: Signer | WalletClient;
    txnData?: SwapParamsResponse;
  }) {
    return await this.contractHandler.handleSwap({ chainId, request, signer, txnData });
  }

  public async bridge({
    chainId,
    request,
    signer,
    txnData,
  }: {
    chainId: number;
    request: BridgeParamsRequest;
    signer: Signer | WalletClient;
    txnData?: BridgeParamsResponse;
  }) {
    return await this.contractHandler.handleBridge({ chainId, request, signer, txnData });
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
