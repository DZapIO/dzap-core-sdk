import { AppEnv, PermitSelector, StatusCodes, TxnStatus } from 'src/enums';
import { DZapAbis, OtherAbis, Services } from 'src/constants';

export type HexString = `0x${string}`;

export type ChainData = {
  [key in number]: Chain;
};

export type NativeTokenInfo = {
  contract: string;
  symbol: string;
  decimals: number;
  name: string;
  balance: string;
  price?: string;
};

export const contractErrorActions = {
  TRY_ANOTHER_ROUTE: 'TRY_ANOTHER_ROUTE',
  INCREASE_SLIPPAGE: 'INCREASE_SLIPPAGE',
  INCREASE_ALLOWANCE: 'INCREASE_ALLOWANCE',
} as const;

export type ContractErrorResponse = {
  status: string;
  txId: string;
  code: number;
  message: string;
  error: unknown;
  action: keyof typeof contractErrorActions;
  details?: unknown;
};
export type CalculatePointsRequest = {
  srcTokens: { amount: string; address: string; decimals: number }[];
  destTokens: { amount: string; address: string; decimals: number }[];
  chainId: number;
  account: string;
  txType: 'swap' | 'bridge';
};

export type Chain = {
  coinKey: string;
  chainId: number;
  chainType: string;
  name: string;
  coin: string;
  dcaContract: string;
  swapBridgeContract: string;
  logo: string;
  tokenlistUrl?: string;
  multicallAddress: string;
  blockExplorerUrl: string;
  nativeToken: NativeTokenInfo;
  rpcProviders: ApiRpcResponse[];
  pricingAvailable: boolean;
  balanceAvailable: boolean;
  supportedAs: {
    source: boolean;
    destination: boolean;
  };
  coingecko?: {
    chainKey: string;
    nativeTokenKey: string;
  };
};

export type ApiRpcResponse = {
  url: string;
  keyRequired: boolean;
  keyType?: 'ALCHEMY_KEY' | 'BLASTAPI_KEY';
};

export type PermitSelectorData = { address: HexString; permitSelector: PermitSelector; permitAllowance: bigint };

// Swap

export type SwapData = {
  sourceId: string;
  srcToken: string;
  destToken: string;
  amount: string;
  slippage: number;
  gasPrice?: number;
  srcDecimals: number;
  destDecimals: number;
  permitData?: string;
  additionalInfo?: Record<string, unknown>;
};

export type SwapParamsRequest = {
  chainId: number;
  integratorId: string;
  sender: string;
  refundee?: string;
  recipient: string;
  withOutRevert?: boolean; // default true
  includeSwapCallData?: boolean; // default false
  includeTxData?: boolean; // default true
  data: Array<SwapData>;
};

export type SwapQuoteData = {
  amount: string;
  selectedSource?: string;
  account: string;
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  slippage: number;
};

export type SwapQuoteRequest = {
  chainId: number;
  integratorId: string;
  data: Array<SwapQuoteData>;
  allowedSources?: string[];
  notAllowedSources?: string[];
};

export type GetSwapParamsResponse = {
  value: string;
  ercSwapDetails: {
    executor: string;
    desc: {
      srcToken: string;
      dstToken: string;
      srcReceiver: string;
      dstReceiver: string;
      amount: string;
      minReturnAmount: string;
      flags: number;
      permit: string;
    };
    routeData: string;
    permit: string;
    minReturnAmount: number;
  }[];
};

export type ProviderDetails = {
  name: string;
  icon: string;
};

export type FeeDetails = {
  address: string;
  decimals: number;
  chainId: number;
  symbol: string;
  logo?: string;
  amount: string;
  amountUSD: string;
  included: boolean;
};

export type Fee = {
  gasFee: FeeDetails[];
  protocolFee: FeeDetails[];
  providerFee: FeeDetails[];
};

export type SwapQuoteResponseData = {
  srcToken: string;
  srcAmount: string;
  destToken: string;
  destAmount: string;
  priceImpactPercent: string | null;
  fee: Fee;
  srcAmountUSD: string | null;
  destAmountUSD: string | null;
  providerDetails: ProviderDetails;
  additionalInfo?: Record<string, unknown>;
};

export type SwapQuoteResponse = {
  [key: string]: {
    status: string;
    errorMessage?: string;
    recommendedSource: string;
    recommendedSourceByAmount: string;
    recommendedSourceByGas: string;
    tokensWithoutPrice: string[];
    quoteRates: {
      [key: string]: {
        data: SwapQuoteResponseData;
      };
    };
  };
};

export type SwapParamsResponse = {
  data: {
    transactionRequest: {
      txId: string;
      data: string;
      to: string;
      from: string;
      chainId: number;
      value: string;
      gasLimit: string;
    };
    updatedQuotes: Record<string, string>;
  };
};

// Bridge

export type BridgeQuoteRequest = {
  account?: string;
  disableEstimation?: boolean;
  integratorId: string;
  fromChain: number;
  allowedSources?: string[];
  notAllowedSources?: string[];
  data: BridgeQuoteRequestData[];
};

export type BridgeQuoteRequestData = {
  amount: string;
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  toChain: number;
  slippage: number;
  selectedSource?: string;
};

export type Step = {
  type: string;
  exchange: {
    logo: string;
    name: string;
  };
};

export type Path = {
  type: string;
  exchange: ProviderDetails;
  srcToken: Token;
  srcAmount: string;
  srcAmountUSD: string;
  destToken: Token;
  destAmount: string;
  destAmountUSD: string;
  fee: Fee;
};

export type BridgeQuoteRate = {
  bridgeDetails?: ProviderDetails;
  providerDetails: ProviderDetails;
  srcAmount: string;
  srcAmountUSD: string;
  destAmount: string;
  destAmountUSD: string;
  minDestAmount: string;
  swapPerUnit: string;
  srcToken: Token;
  destToken: Token;
  fee: Fee;
  priceImpactPercent: string;
  duration: string;
  steps: Step[];
  path: Path[];
  additionalInfo?: BridgeAdditionalInfo;
};

export type BridgeQuotes = {
  [providerAndBridge: string]: BridgeQuoteRate;
};

export type BridgeQuoteResponse = {
  [pair: string]: {
    status?: string;
    message?: string;
    recommendedSource?: string;
    quoteRates?: BridgeQuotes;
    tokensWithoutPrice: Record<number, string[]>;
  };
};

export type BridgeSource = {
  provider: string;
  bridge: string;
};

export type BridgeAdditionalInfo = {
  [key: string]: unknown;
};

export type Token = {
  address: HexString;
  decimals: number;
  chainId: number;
  logo: string;
  symbol: string;
  price?: string;
};

export type TokenInfo = NativeTokenInfo & {
  chainId: number;
  balanceInUsd?: number | null;
};

export type TokenResponse = {
  [key: string]: TokenInfo;
};

// Bridge Params

export type BridgeParamsRequest = {
  sender: HexString;
  refundee: HexString;
  integratorId: string;
  fromChain: number;
  disableEstimation?: boolean;
  data: BridgeParamsRequestData[];
};

export type BridgeParamsRequestData = {
  amount: string;
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  toChain: number;
  selectedRoute: string;
  recipient: string;
  slippage: number;
  additionalInfo?: BridgeAdditionalInfo;
  permitData?: string;
};

export type BridgeParamsResponse = {
  data: HexString;
  to: HexString;
  from: HexString;
  chainId: number;
  value: string;
  gasLimit: string;
  additionalInfo?: BridgeAdditionalInfo;
  updatedQuotes: Record<string, string>;
};

export type AvailableDZapServices = (typeof Services)[keyof typeof Services];

export type DZapAvailableAbis = (typeof DZapAbis)[keyof typeof DZapAbis];

export type OtherAvailableAbis = (typeof OtherAbis)[keyof typeof OtherAbis];

export type AppEnvType = `${AppEnv}`;

export type DZapTransactionResponse = {
  status: TxnStatus;
  errorMsg?: string;
  code: StatusCodes | number;
  action?: keyof typeof contractErrorActions;
  txnHash?: HexString;
  error?: unknown;
  additionalInfo?: Record<string, unknown>;
  updatedQuotes?: Record<string, string>;
};
