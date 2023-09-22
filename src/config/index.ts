import { ContractInterface } from "ethers";
import { abi as swapAbiV1point2 } from "../artifacts/v1.2/DZapAggregator";
import { abi as swapAbiV1point3 } from "../artifacts/v1.3/DZapAggregator";
import { abi as swapAbiV2 } from "../artifacts/v2/DZapAggregator";

export const baseUrl = "https://dzap-staging-v2-lqtpzlbt3q-lz.a.run.app/";
// export const baseUrl = "http://localhost:8080/";
// export const baseUrl = "https://api.dzap.io/";

export interface DeFiContract {
  [key: string]: {
    abi: ContractInterface;
    [key: number]: string;
  };
}

export const defaultSwapVersion = "v2";

export const SWAP_CONTRACTS: DeFiContract = {
  "v1.2": {
    1: "0x3af3cc4930ef88F4afe0b695Ac95C230E1A108Ec",
    137: "0x3af3cc4930ef88F4afe0b695Ac95C230E1A108Ec",
    56: "0x3af3cc4930ef88F4afe0b695Ac95C230E1A108Ec",
    42161: "0x3af3cc4930ef88F4afe0b695Ac95C230E1A108Ec",
    abi: swapAbiV1point2,
  },
  "v1.3": {
    324: "0x244C41d354F8311b68C8B934f2A43EADb93f2E2F",
    10: "0x3af3cc4930ef88F4afe0b695Ac95C230E1A108Ec",
    abi: swapAbiV1point3,
  },
  v2: {
    1: "0x3af3cc4930ef88F4afe0b695Ac95C230E1A108Ec",
    137: "0xDE74A179Bfb939533cAa344B402F11855AFC6fF5",
    56: "0x3af3cc4930ef88F4afe0b695Ac95C230E1A108Ec",
    10: "0x45f4883c5777dFA2e905F55f095554B1a20E23B7",
    42161: "0x45f4883c5777dFA2e905F55f095554B1a20E23B7",
    abi: swapAbiV2,
  },
};

export const batchSwapIntegrators: {
  [key: string]: {
    contract: string;
  };
} = {
  dZap: {
    contract: "0x12480616436DD6D555f88B8d94bB5156E28825B1",
  },
};
