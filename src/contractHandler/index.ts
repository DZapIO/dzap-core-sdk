import { StatusCodes, TxnStatus } from 'src/enums';
import { buildBridgeTransaction, buildSwapTransaction } from 'src/api';
import { contractAddress, zkSyncChainId } from 'src/constants/contract';
import {
  AvailableDZapServices,
  BridgeParamsRequest,
  BridgeParamsResponse,
  ContractErrorResponse,
  DZapTransactionResponse,
  HexString,
  SwapParamsRequest,
  SwapParamsResponse,
} from '../types';
import { getDZapAbi, isTypeSigner } from '../utils';
import { handleViemTransactionError, isAxiosError } from '../utils/errors';

import { Signer } from 'ethers';
import { appEnv } from 'src/config';
import { Services } from 'src/constants';
import { CURRENT_VERSION } from 'src/utils/contract';
import { WalletClient } from 'viem';
import { viemChainsById } from 'src/utils/chains';

class ContractHandler {
  private static instance: ContractHandler;
  // private constructor() {}

  public static getInstance(): ContractHandler {
    if (!ContractHandler.instance) {
      ContractHandler.instance = new ContractHandler();
    }
    return ContractHandler.instance;
  }

  public getDZapContractAddress = ({ chainId, service }: { chainId: number; service: AvailableDZapServices }) => {
    return contractAddress[appEnv as string][service][CURRENT_VERSION[service]]?.address[
      chainId === zkSyncChainId ? 'zkSync' : 'otherChains'
    ] as HexString;
  };

  public async handleSwap({
    chainId,
    request,
    signer,
    txnData,
  }: {
    chainId: number;
    request: SwapParamsRequest;
    signer: Signer | WalletClient;
    txnData?: SwapParamsResponse;
  }): Promise<DZapTransactionResponse> {
    const abi = getDZapAbi(Services.swap);
    try {
      let buildTxnResponseData: SwapParamsResponse;
      if (txnData) {
        buildTxnResponseData = txnData;
      } else {
        buildTxnResponseData = await buildSwapTransaction(request);
      }
      const {
        data: {
          transactionRequest: { data, from, to, value, gasLimit },
        },
      } = buildTxnResponseData;
      if (isTypeSigner(signer)) {
        console.log('Using ethers signer.');
        const txnRes = await signer.sendTransaction({
          from,
          to,
          data,
          value,
          gasLimit,
        });
        return {
          status: TxnStatus.success,
          code: StatusCodes.Success,
          txnHash: txnRes.hash as HexString,
        };
      } else {
        console.log('Using viem walletClient.');
        const txnHash = await signer.sendTransaction({
          chain: viemChainsById[chainId],
          account: from as HexString,
          to: to as HexString,
          data: data as HexString,
          value: BigInt(value),
        });
        return {
          status: TxnStatus.success,
          code: StatusCodes.Success,
          txnHash,
        };
      }
    } catch (error: any) {
      console.log({ error });
      if (isAxiosError(error)) {
        if (error?.response?.status === StatusCodes.SimulationFailure) {
          return {
            status: TxnStatus.error,
            errorMsg: 'Simulation Failed',
            error: (error.response?.data as ContractErrorResponse).message,
            code: (error.response?.data as ContractErrorResponse).code,
            action: (error.response?.data as ContractErrorResponse).action,
          };
        }
        return {
          status: TxnStatus.error,
          errorMsg: 'Params Failed: ' + JSON.stringify((error?.response?.data as any)?.message),
          error: error?.response?.data ?? error,
          code: error?.response?.status ?? StatusCodes.Error,
        };
      }
      return handleViemTransactionError({ abi, error });
    }
  }

  public async handleBridge({
    chainId,
    request,
    signer,
    txnData,
  }: {
    chainId: number;
    request: BridgeParamsRequest;
    signer: Signer | WalletClient;
    txnData?: BridgeParamsResponse;
  }): Promise<DZapTransactionResponse> {
    const abi = getDZapAbi(Services.bridge);
    try {
      let buildTxnResponseData: BridgeParamsResponse;
      if (txnData) {
        buildTxnResponseData = txnData;
      } else {
        buildTxnResponseData = await buildBridgeTransaction(request);
      }
      const { data, from, to, value, gasLimit, additionalInfo, updatedQuotes } = buildTxnResponseData;
      if (isTypeSigner(signer)) {
        console.log('Using ethers signer.');
        const txnRes = await signer.sendTransaction({
          from,
          to,
          data,
          value,
          gasLimit,
        });
        return {
          status: TxnStatus.success,
          code: StatusCodes.Success,
          txnHash: txnRes.hash as HexString,
          additionalInfo,
          updatedQuotes,
        };
      } else {
        console.log('Using viem walletClient.');
        const txnHash = await signer.sendTransaction({
          chain: viemChainsById[chainId],
          account: from as HexString,
          to: to as HexString,
          data: data as HexString,
          value: BigInt(value),
        });
        return {
          status: TxnStatus.success,
          code: StatusCodes.Success,
          txnHash,
          additionalInfo,
        };
      }
    } catch (error: any) {
      console.log({ error });
      if (isAxiosError(error)) {
        if (error?.response?.status === StatusCodes.SimulationFailure) {
          return {
            status: TxnStatus.error,
            errorMsg: 'Simulation Failed',
            error: (error.response?.data as ContractErrorResponse).message,
            code: (error.response?.data as ContractErrorResponse).code,
            action: (error.response?.data as ContractErrorResponse).action,
          };
        }
        return {
          status: TxnStatus.error,
          errorMsg: 'Params Failed: ' + JSON.stringify((error?.response?.data as any)?.message),
          error: error?.response?.data ?? error,
          code: error?.response?.status ?? StatusCodes.Error,
        };
      }
      return handleViemTransactionError({ abi, error });
    }
  }
}

export default ContractHandler;
