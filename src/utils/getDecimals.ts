import { SwapQuoteRequest } from 'src/types';

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
