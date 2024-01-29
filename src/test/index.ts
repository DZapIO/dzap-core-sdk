import useClient from '../hooks/useClient';

const TEST_CHAIN_ID = {
  chainId: 137,
};

const quoteRequests = {
  chainId: 137,
  integrator: 'dzap',
  request: [
    {
      amount: '200000000000000000',
      fromTokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      toTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      slippage: 1,
      globalAmount: '0.2',
      account: '0x12480616436dd6d555f88b8d94bb5156e28825b1',
    },
    {
      amount: '200000000000000000',
      fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      toTokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      slippage: 1,
      globalAmount: '0.2',
      account: '0x12480616436dd6d555f88b8d94bb5156e28825b1',
    },
  ],
};

const paramRequest = {
  chainId: 137,
  integratorId: 'dzap',
  sender: '0x12480616436dd6d555f88b8d94bb5156e28825b1',
  refundee: '0x12480616436dd6d555f88b8d94bb5156e28825b1',
  recipient: '0x12480616436dd6d555f88b8d94bb5156e28825b1',
  data: [
    {
      sourceId: 'paraSwap',
      amount: '100000',
      srcToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      dstToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      slippage: 1,
    },
    {
      sourceId: 'oneInch',
      amount: '1000000000000000',
      srcToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      dstToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      slippage: 1,
    },
  ],
};

export async function TestGetQuoteRate() {
  let response;
  console.log('TestGetQuoteRate');
  const { getQuoteRate: getQuoteRateUsingdzapClient } =
    useClient(TEST_CHAIN_ID);
  try {
    response = await getQuoteRateUsingdzapClient(quoteRequests);
  } catch (e) {
    console.log(e, 'request error ');
  }

  console.log(response);
}

export async function TestGetSwapParams() {
  let response;
  console.log('TestGetSwapParams');
  const { getSwapParams: getParamUsingdzapClient } = useClient(TEST_CHAIN_ID);
  try {
    response = await getParamUsingdzapClient(paramRequest);
  } catch (e) {
    console.log(e, 'request error ');
  }

  console.log(response);
}
