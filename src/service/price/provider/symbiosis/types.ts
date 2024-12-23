export type SymbiosisRequest = { address: string; chain_id: number };
export type SymbiosisResponse = SymbiosisRequest & { price: number };
