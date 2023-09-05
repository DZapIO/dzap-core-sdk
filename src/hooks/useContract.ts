import { ethers, Signer } from "ethers";
import { SWAP_CONTRACTS } from "src/config";
import { SwapParamRequest } from "src/types";
import { Contract } from "zksync-web3";
import { fetchSwapParams } from "../api";
import {
  getChecksumAddress,
  getIntegratorInfo,
  getTrxId,
  purgeSwapVersion,
} from "../utils";
import { getNetworkFee } from "../utils/GasFee";

function useContract({
  chainId,
  provider,
  clientId,
}: {
  chainId: number;
  provider: Signer;
  clientId?: number;
}) {
  const getContractAddress = (version?: string): string => {
    try {
      const address = SWAP_CONTRACTS[purgeSwapVersion(version)][chainId];
      return getChecksumAddress(address);
    } catch (err) {
      throw new Error("Unsupported chainId");
    }
  };

  const getContract = (version?: string): any => {
    try {
      const purgedVersion = purgeSwapVersion(version);
      const abi = SWAP_CONTRACTS[purgedVersion].abi;
      return chainId === 324
        ? new Contract(getContractAddress(purgedVersion), abi, provider)
        : new ethers.Contract(getContractAddress(purgedVersion), abi, provider);
    } catch (error) {
      throw error;
    }
  };
  const swap = async (
    {
      request,
      recipient,
      integrator,
      version,
    }: {
      request: SwapParamRequest[];
      recipient: string;
      integrator?: string;
      version?: string;
    },
    trxSpeed?: "low" | "medium" | "high"
  ): Promise<any> => {
    try {
      const integratorInfo = getIntegratorInfo(integrator);
      const contract = getContract(version);
      const { swapDetails, value } = await fetchSwapParams(
        request,
        chainId,
        integrator
      );
      const uuid = getTrxId(recipient);
      const params = [
        uuid,
        integratorInfo.contract,
        recipient,
        recipient,
        swapDetails,
      ];
      const networkFee = await getNetworkFee(chainId);
      const result = await contract.multiSwap(...params, {
        gasPrice: networkFee[trxSpeed || "medium"],
        value,
      });
      return result;
    } catch (err) {
      throw err;
    }
  };
  return {
    swap,
    getContractAddress,
    getContract,
  };
}
export default useContract;
