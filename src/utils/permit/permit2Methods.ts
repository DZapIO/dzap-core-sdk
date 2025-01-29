import { DEFAULT_PERMIT2_ADDRESS, exclusivePermit2Addresses } from 'src/constants/contract';
import { MaxAllowanceExpiration, MaxAllowanceTransferAmount, SignatureExpiryInSecs } from 'src/constants/permit2';
import { Erc20Functions, Erc20PermitFunctions, PermitType, StatusCodes, TxnStatus } from 'src/enums';
import { HexString } from 'src/types';
import { Abi, WalletClient, decodeAbiParameters, encodeAbiParameters, erc20Abi, parseAbiParameters } from 'viem';
import { abi as Permit2Abi } from '../../artifacts/Permit2';
import { readContract } from '../index';

export function getPermit2Address(chainId: number): HexString {
  return exclusivePermit2Addresses[chainId] ?? DEFAULT_PERMIT2_ADDRESS;
}

export const checkPermit2 = async ({
  srcToken,
  userAddress,
  chainId,
  rpcUrls,
}: {
  srcToken: string;
  userAddress: string;
  chainId: number;
  rpcUrls?: string[];
}) => {
  try {
    const permitAllowanceRes = await readContract({
      chainId,
      contractAddress: srcToken as HexString,
      abi: erc20Abi,
      functionName: Erc20Functions.allowance,
      args: [userAddress, getPermit2Address(chainId)],
      rpcUrls,
    });
    if (permitAllowanceRes.code !== StatusCodes.Success) {
      return { status: TxnStatus.error, code: StatusCodes.Error, data: { permitAllowance: BigInt(0) } };
    }
    return { status: TxnStatus.success, code: StatusCodes.Success, data: { permitAllowance: permitAllowanceRes.data as bigint } };
  } catch (e: any) {
    console.log({ e });
    if (e?.cause?.code === StatusCodes.UserRejectedRequest || e?.code === StatusCodes.UserRejectedRequest) {
      return { status: TxnStatus.rejected, code: StatusCodes.UserRejectedRequest, data: { permitAllowance: BigInt(0) } };
    }
    return { status: TxnStatus.error, code: e.code, data: { permitAllowance: BigInt(0) } };
  }
};

export async function getPermit2PermitDataForApprove({
  chainId,
  dzapContractAddress,
  account,
  token,
  signer,
  rpcUrls,
  amount = BigInt(MaxAllowanceTransferAmount.toString()),
  sigDeadline = BigInt((SignatureExpiryInSecs + Math.floor(Date.now() / 1000)).toString()),
  expiration = BigInt(MaxAllowanceExpiration.toString()),
}: {
  chainId: number;
  account: string;
  token: string;
  dzapContractAddress: string;
  rpcUrls?: string[];
  sigDeadline?: bigint;
  amount?: bigint;
  signer: WalletClient;
  expiration?: bigint;
}) {
  try {
    const permit2Address = getPermit2Address(chainId);
    const nonceRes = await readContract({
      chainId,
      contractAddress: permit2Address,
      abi: Permit2Abi as Abi,
      functionName: Erc20PermitFunctions.allowance,
      args: [account, token, dzapContractAddress],
      rpcUrls,
    });
    if (nonceRes.code !== StatusCodes.Success) {
      return { status: nonceRes.status, code: nonceRes.code, permitData: null };
    }
    const nonce = nonceRes.data as bigint[];
    const PERMIT2_DOMAIN_NAME = 'Permit2';
    const domain = { chainId, name: PERMIT2_DOMAIN_NAME, verifyingContract: permit2Address };

    const permitApprove = {
      details: {
        token,
        amount,
        expiration,
        nonce: nonce[2],
      },
      spender: dzapContractAddress,
      sigDeadline,
    };
    const types = {
      PermitSingle: [
        { name: 'details', type: 'PermitDetails' },
        { name: 'spender', type: 'address' },
        { name: 'sigDeadline', type: 'uint256' },
      ],
      PermitDetails: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint160' },
        { name: 'expiration', type: 'uint48' },
        { name: 'nonce', type: 'uint48' },
      ],
    };
    const values = permitApprove;
    const signature = await signer.signTypedData({
      account: account as HexString,
      domain,
      message: values,
      primaryType: 'PermitSingle',
      types,
    });
    const customPermitDataForTransfer = encodeAbiParameters(
      parseAbiParameters('uint160 allowanceAmount, uint48 nonce, uint48 expiration, uint256 sigDeadline, bytes signature'),
      [
        BigInt(permitApprove.details.amount.toString()),
        Number(permitApprove.details.nonce.toString()),
        Number(permitApprove.details.expiration.toString()),
        BigInt(permitApprove.sigDeadline.toString()),
        signature,
      ],
    );
    const permitData = encodeAbiParameters(parseAbiParameters('uint8, bytes'), [PermitType.PERMIT2_APPROVE, customPermitDataForTransfer]);
    return { status: TxnStatus.success, permitData, code: StatusCodes.Success };
  } catch (e: any) {
    if (e?.cause?.code === StatusCodes.UserRejectedRequest || e?.code === StatusCodes.UserRejectedRequest) {
      return { status: TxnStatus.rejected, code: StatusCodes.UserRejectedRequest, permitdata: null };
    }
    return { status: TxnStatus.error, code: e.code, permitData: null };
  }
}

export async function validatePermit2Data({
  permitData,
  srcToken,
  amount,
  account,
  chainId,
  rpcUrls,
}: {
  permitData: HexString;
  srcToken: string;
  amount: bigint;
  account: HexString;
  chainId: number;
  rpcUrls: string[];
}): Promise<{
  status: TxnStatus;
  code: StatusCodes;
  isValid: boolean;
  details?: {
    nonce: bigint;
    currentNonce: bigint;
    expiration: bigint;
    sigDeadline: bigint;
  };
}> {
  try {
    // Decode permit type and details
    const [permitType, permitDetails] = decodeAbiParameters([{ type: 'uint8' }, { type: 'bytes' }], permitData);

    // Skip validation for non-PERMIT2_APPROVE types
    if (permitType !== PermitType.PERMIT2_APPROVE) {
      return {
        status: TxnStatus.success,
        code: StatusCodes.Success,
        isValid: true,
      };
    }

    const permit2Address = getPermit2Address(chainId);

    // Decode permit details including nonce
    const [nonce, expiration, sigDeadline] = decodeAbiParameters(
      [{ type: 'uint160' }, { type: 'uint48' }, { type: 'uint48' }, { type: 'uint256' }],
      permitDetails,
    );

    // Get current nonce from permit2 contract
    const nonceRes = await readContract({
      chainId,
      contractAddress: permit2Address,
      abi: Permit2Abi as Abi,
      functionName: Erc20PermitFunctions.allowance,
      args: [account, srcToken, permit2Address],
      rpcUrls,
    });

    if (nonceRes.code !== StatusCodes.Success) {
      return {
        status: nonceRes.status,
        code: nonceRes.code,
        isValid: false,
      };
    }

    const currentNonce = (nonceRes.data as bigint[])[2];

    // Check current permit2 allowance
    const {
      status,
      code,
      data: { permitAllowance },
    } = await checkPermit2({
      chainId,
      srcToken,
      userAddress: account,
      rpcUrls,
    });

    if (code !== StatusCodes.Success) {
      return {
        status,
        code,
        isValid: false,
      };
    }

    // Get current timestamp
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));

    // Check if permit is valid (allowance, nonce, and expiration)
    const isValid =
      permitAllowance >= amount && BigInt(nonce) === currentNonce && BigInt(sigDeadline) > currentTimestamp && BigInt(expiration) > currentTimestamp;

    return {
      status: TxnStatus.success,
      code: StatusCodes.Success,
      isValid,
      details: {
        nonce: BigInt(nonce),
        currentNonce,
        expiration: BigInt(expiration),
        sigDeadline: BigInt(sigDeadline),
      },
    };
  } catch (error) {
    console.error('Error validating permit2 data:', error);
    return {
      status: TxnStatus.error,
      code: StatusCodes.Error,
      isValid: false,
    };
  }
}
