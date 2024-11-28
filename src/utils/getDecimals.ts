import { BridgeQuoteRequest, SwapQuoteRequest } from 'src/types';

export const getDecimals = (
  request: SwapQuoteRequest,
  srcToken: string,
  destToken: string,
): { srcDecimals: number; destDecimals: number } | undefined => {
  const data = request.data.find((d) => d.srcToken === srcToken && d.destToken === destToken);
  if (!data) return undefined;
  return {
    srcDecimals: data.srcDecimals,
    destDecimals: data.destDecimals,
  };
};

export const getDecimalsFromBridge = (
  request: BridgeQuoteRequest,
  srcToken: string,
  destToken: string,
): { srcDecimals: number; destDecimals: number; toChainId: number } | undefined => {
  const data = request.data.find((d) => d.srcToken === srcToken && d.destToken === destToken);
  if (!data) return undefined;
  return {
    srcDecimals: data.srcDecimals,
    toChainId: data.toChain,
    destDecimals: data.destDecimals,
  };
};
