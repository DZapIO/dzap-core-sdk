import { OtherAbis, Services } from './constants';
import { SignatureExpiryInSecs } from './constants/permit2';
import { Erc20Functions, PermitFunctionSelector, PermitSelector, PermitType, StatusCodes, TxnStatus } from './enums';
import {
  ApiRpcResponse,
  BridgeParamsRequest,
  BridgeParamsRequestData,
  BridgeParamsResponse,
  BridgeQuoteRequest,
  BridgeQuoteRequestData,
  BridgeQuoteResponse,
  Chain,
  ChainData,
  contractErrorActions,
  ContractErrorResponse,
  DZapTransactionResponse,
  GetSwapParamsResponse,
  HexString,
  Path,
  PermitSelectorData,
  SwapData,
  SwapParamsRequest,
  SwapQuoteData,
  SwapQuoteRequest,
  SwapQuoteResponse,
  SwapParamsResponse,
} from './types';

import DzapClient from './client';

// import { TestHook } from './test';
// Test Scripts
// import { TestGetQuoteRate, TestGetSwapParams } from './test';
// TestHook();
// TestGetQuoteRate();
// TestGetSwapParams();
export default DzapClient;

export {
  ApiRpcResponse,
  BridgeParamsRequest,
  BridgeParamsRequestData,
  BridgeParamsResponse,
  BridgeQuoteRequest,
  BridgeQuoteRequestData,
  BridgeQuoteResponse,
  Chain,
  ChainData,
  contractErrorActions,
  ContractErrorResponse,
  SignatureExpiryInSecs,
  DZapTransactionResponse,
  Erc20Functions,
  GetSwapParamsResponse,
  HexString,
  OtherAbis,
  Path,
  PermitFunctionSelector,
  PermitSelector,
  PermitSelectorData,
  PermitType,
  Services,
  StatusCodes,
  SwapData,
  SwapParamsRequest,
  SwapQuoteData,
  SwapQuoteRequest,
  SwapQuoteResponse,
  SwapParamsResponse,
  TxnStatus,
};
