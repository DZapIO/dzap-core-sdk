export const defiLlamaConfig = {
  url: (tokens: string[]): string => `https://coins.llama.fi/prices/current/${tokens.join(',')}`,
};
