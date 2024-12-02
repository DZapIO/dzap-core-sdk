export const zeroAddress = '0x0000000000000000000000000000000000000000';
export const eFormatNativeTokenLowerCase = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const eFormatNativeToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const zkNativeToken = '0x000000000000000000000000000000000000800A';
export const solanaNativeToken = '11111111111111111111111111111111';
export const unmarshalDeadAddress = '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000';
export const tonNativeToken = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';
export const artheraNativeToken = '0x000000000000000000000000000000000000aA09';
export const suiNativeToken = '0x2::sui::SUI';
export const celoNativeToken = '0x471EcE3750Da237f93B8E339c536989b8978a438';
export const nativeTokens: string[] = [
  '0x0000000000000000000000000000000000001010',
  eFormatNativeTokenLowerCase,
  eFormatNativeToken,
  zeroAddress,
  zkNativeToken,
  solanaNativeToken,
  unmarshalDeadAddress,
  tonNativeToken,
  artheraNativeToken,
  suiNativeToken,
  celoNativeToken,
];

export const dZapNativeTokenFormat = zeroAddress;

export const CHAINS_IDS = {
  solana: 7565164,
  sui: 19219,
  celo: 42220,
  arthera: 10242,
} as const;

export const getDZapNativeTokenByChainId = (chainId: number) => {
  switch (chainId) {
    case CHAINS_IDS.solana:
      return solanaNativeToken;
    case CHAINS_IDS.celo:
      return '0x471EcE3750Da237f93B8E339c536989b8978a438';
    case CHAINS_IDS.arthera:
      return artheraNativeToken;
    case CHAINS_IDS.sui:
      return suiNativeToken;
    default:
      return zeroAddress;
  }
};
