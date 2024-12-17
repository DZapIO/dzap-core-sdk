import * as ABI from '../artifacts';
import { DZapAbis, OtherAbis, Services, dZapNativeTokenFormat } from 'src/constants';
import { StatusCodes, TxnStatus } from 'src/enums';
import {
  Abi,
  ParseEventLogsReturnType,
  TransactionReceipt,
  WalletClient,
  createPublicClient,
  fallback,
  getAddress,
  http,
  parseEventLogs,
  stringToHex,
} from 'viem';
import { batchSwapIntegrators, isStaging } from '../config';
import { AvailableDZapServices, BridgeParamsRequestData, HexString, OtherAvailableAbis, SwapData } from '../types';

import { Signer } from 'ethers';
import { RPC_BATCHING_WAIT_TIME, RPC_RETRY_DELAY } from 'src/constants/rpc';
import { viemChainsById } from './chains';

const publicClientRpcConfig = { batch: { wait: RPC_BATCHING_WAIT_TIME }, retryDelay: RPC_RETRY_DELAY };

export const initializeReadOnlyProvider = ({ rpcUrls, chainId }: { rpcUrls: string[] | undefined; chainId: number }) => {
  return createPublicClient({
    chain: viemChainsById[chainId],
    transport: fallback(rpcUrls ? rpcUrls.map((rpc: string) => http(rpc, publicClientRpcConfig)) : [http()]),
  });
};

export const readContract = async ({
  chainId,
  contractAddress,
  abi,
  functionName,
  rpcUrls,
  args = [],
}: {
  chainId: number;
  contractAddress: HexString;
  abi: Abi;
  functionName: string;
  rpcUrls?: string[];
  args?: unknown[];
}) => {
  try {
    const result = await initializeReadOnlyProvider({ chainId, rpcUrls }).readContract({
      address: contractAddress,
      abi,
      functionName,
      args,
    });
    return { data: result, status: TxnStatus.success, code: StatusCodes.Success };
  } catch (e: any) {
    console.log({ e });
    return { status: TxnStatus.error, code: e.code || StatusCodes.Error };
  }
};

export const writeContract = async ({
  chainId,
  contractAddress,
  abi,
  functionName,
  args = [],
  userAddress,
  value = '0',
  rpcUrls = [''],
  signer,
}: {
  chainId: number;
  contractAddress: HexString;
  abi: Abi;
  functionName: string;
  args?: unknown[];
  userAddress: HexString;
  value?: string;
  rpcUrls?: string[];
  signer: WalletClient;
}) => {
  const publicClient = initializeReadOnlyProvider({ chainId, rpcUrls });
  try {
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName,
      args,
      account: userAddress,
      value: BigInt(value),
    });
    const hash = await signer.writeContract(request);
    return { txnHash: hash, status: TxnStatus.success, code: StatusCodes.Success };
  } catch (e: any) {
    console.log({ e });
    if (e?.code === StatusCodes.UserRejectedRequest) {
      return { status: TxnStatus.rejected, code: e?.code, txnHash: '' };
    }
    return { status: TxnStatus.error, code: e?.code, txnHash: '' };
  }
};

export const calcTotalSrcTokenAmount = (data: BridgeParamsRequestData[] | SwapData[]) => {
  return data.reduce((acc, obj) => {
    return acc + BigInt(obj.amount);
  }, BigInt(0));
};

export const isOneToMany = (firstTokenAddress: string, secondTokenAddress: string) => firstTokenAddress === secondTokenAddress;

export const getChecksumAddress = (address: string): HexString => getAddress(address);

export const getIntegratorInfo = (integrator: string) => batchSwapIntegrators[integrator] || batchSwapIntegrators.dZap;

export const generateUUID = () => {
  let d = new Date().getTime();
  let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxxx-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxx-xxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  const uuidInBytes = stringToHex(uuid, { size: 32 });
  return uuidInBytes;
};

export const getTrxId = (account: string) => {
  const uuid = `${account.slice(0, 6)}...${account.slice(36, 42)}-${Date.now()}`;
  console.log(uuid);

  const uuidInBytes = stringToHex(uuid, { size: 32 });
  return uuidInBytes;
};

export const estimateGasMultiplier = BigInt(15) / BigInt(10); // .toFixed(0);

export const isTypeSigner = (variable: any): variable is Signer => {
  return variable instanceof Signer;
};

export const isDZapNativeToken = (srcToken: string) => srcToken === dZapNativeTokenFormat;

export const getDZapAbi = (service: AvailableDZapServices) => {
  switch (service) {
    case Services.swap:
    case Services.bridge:
      return isStaging ? ABI[DZapAbis.stagingDZapCoreAbi] : ABI[DZapAbis.dZapCoreAbi];
    case Services.dca:
      return ABI[DZapAbis.dZapDcaAbi];
    default:
      throw new Error('Invalid Service');
  }
};

export const handleDecodeTrxData = (data: TransactionReceipt, service: AvailableDZapServices) => {
  let events: ParseEventLogsReturnType<Abi, undefined, true, any> = [];
  try {
    events = parseEventLogs({
      abi: getDZapAbi(service),
      logs: data.logs,
    });
  } catch (e) {
    events = [];
  }
  events = events?.filter((item: any) => item !== null);

  const swapInfo = Array.isArray(events) && events.length > 0 ? (events[0]?.args as { swapInfo: unknown })?.swapInfo : [];

  return swapInfo;
};

export const getOtherAbis = (name: OtherAvailableAbis) => {
  switch (name) {
    case OtherAbis.permit2:
      return ABI.permit2Abi;
    case OtherAbis.erc20:
      return ABI.erc20Abi;
    default:
      throw new Error('Invalid Abi');
  }
};
