export const abi = [
  {
    inputs: [
      {
        internalType: 'uint256[3]',
        name: 'fees_',
        type: 'uint256[3]',
      },
      {
        internalType: 'address[]',
        name: 'routers_',
        type: 'address[]',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'isSupported',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
        ],
        internalType: 'struct Router[]',
        name: 'routerDetails_',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'governor_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'aggregationRouter_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wNative_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'protocolFeeVault_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'feeDiscountNft_',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'enum FeeType[]',
        name: 'feeTypes',
        type: 'uint8[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'fees',
        type: 'uint256[]',
      },
    ],
    name: 'FeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'feeVault',
        type: 'address',
      },
    ],
    name: 'FeeVaultUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'formerGov',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newGov',
        type: 'address',
      },
    ],
    name: 'GovernanceChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct Token[]',
        name: 'inputTokens',
        type: 'tuple[]',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'outputLp',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[3]',
        name: 'returnAmounts',
        type: 'uint256[3]',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'feeBps',
        type: 'uint256[2]',
      },
    ],
    name: 'LiquidityAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            internalType: 'struct Token[]',
            name: 'lpInput',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            internalType: 'struct Token[]',
            name: 'lpOutput',
            type: 'tuple[]',
          },
        ],
        indexed: false,
        internalType: 'struct LPSwapInfo',
        name: 'swapInfo',
        type: 'tuple',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'feeBps',
        type: 'uint256[2]',
      },
    ],
    name: 'LpSwapped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'ProjectAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'ProjectFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'ProjectFeeVaultUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'ProjectNftUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'ProjectStatusDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'enum FeeType[]',
        name: 'feeTypes',
        type: 'uint8[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'fees',
        type: 'uint256[]',
      },
    ],
    name: 'ProtocolFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'newProtocolFeeVault',
        type: 'address',
      },
    ],
    name: 'ProtocolFeeVaultUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'routers',
        type: 'address[]',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'isSupported',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct Router[]',
        name: 'details',
        type: 'tuple[]',
      },
    ],
    name: 'RoutersUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'srcToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'dstToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'returnAmount',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct SwapInfo',
        name: 'swapInfo',
        type: 'tuple',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'feeBps',
        type: 'uint256[2]',
      },
    ],
    name: 'TokenSwapped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TokensRescued',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'srcToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'dstToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'returnAmount',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct SwapInfo[]',
        name: 'swapInfo',
        type: 'tuple[]',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'feeBps',
        type: 'uint256[2]',
      },
    ],
    name: 'TokensSwapped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            internalType: 'struct Token[]',
            name: 'data',
            type: 'tuple[]',
          },
        ],
        indexed: false,
        internalType: 'struct TransferInfo[]',
        name: 'details',
        type: 'tuple[]',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'feeBps',
        type: 'uint256[2]',
      },
    ],
    name: 'TokensTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'AGGREGATION_ROUTER',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BPS_DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[3]',
        name: 'fees_',
        type: 'uint256[3]',
      },
      {
        internalType: 'address',
        name: 'feeVault_',
        type: 'address',
      },
    ],
    name: 'addProject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'bytes',
                name: 'permit',
                type: 'bytes',
              },
            ],
            internalType: 'struct InputTokenData[]',
            name: 'data',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct TransferDetails[]',
        name: 'data_',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId_',
        type: 'uint256',
      },
    ],
    name: 'batchTransfer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountA_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountB_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveA_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveB_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'router_',
        type: 'address',
      },
    ],
    name: 'calculateOptimalSwapAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newGov_',
        type: 'address',
      },
    ],
    name: 'changeGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
    ],
    name: 'disableProject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeDiscountNft',
    outputs: [
      {
        internalType: 'contract DZapDiscountNft',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'governance',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextProjectId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'enum FeeType',
        name: '',
        type: 'uint8',
      },
    ],
    name: 'projectFeeBps',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'projectFeeVault',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum FeeType',
        name: '',
        type: 'uint8',
      },
    ],
    name: 'protocolFeeBps',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'protocolFeeVault',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'token_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'rescueFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'routers',
    outputs: [
      {
        internalType: 'bool',
        name: 'isSupported',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'fees',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
          {
            internalType: 'address[]',
            name: 'tokenAToPath',
            type: 'address[]',
          },
          {
            internalType: 'address[]',
            name: 'tokenBToPath',
            type: 'address[]',
          },
        ],
        internalType: 'struct LpSwapDetails[]',
        name: 'lpSwapDetails_',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'sizeBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minReturnAmount',
            type: 'uint256',
          },
          {
            internalType: 'address[]',
            name: 'nativeToOutputPath',
            type: 'address[]',
          },
        ],
        internalType: 'struct WNativeSwapDetails[]',
        name: 'wEthSwapDetails_',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId_',
        type: 'uint256',
      },
    ],
    name: 'swapLpToTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IAggregationExecutor',
            name: 'executor',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'srcToken',
                type: 'address',
              },
              {
                internalType: 'contract IERC20',
                name: 'dstToken',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'srcReceiver',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'dstReceiver',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'minReturnAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'flags',
                type: 'uint256',
              },
            ],
            internalType: 'struct SwapDescription',
            name: 'desc',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'routeData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
        ],
        internalType: 'struct SwapDetails',
        name: 'data_',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId_',
        type: 'uint256',
      },
    ],
    name: 'swapToken',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IAggregationExecutor',
            name: 'executor',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'srcToken',
                type: 'address',
              },
              {
                internalType: 'contract IERC20',
                name: 'dstToken',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'srcReceiver',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'dstReceiver',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'minReturnAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'flags',
                type: 'uint256',
              },
            ],
            internalType: 'struct SwapDescription',
            name: 'desc',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'routeData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
        ],
        internalType: 'struct SwapDetails[]',
        name: 'data_',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
          {
            internalType: 'address[]',
            name: 'tokenAToPath',
            type: 'address[]',
          },
          {
            internalType: 'address[]',
            name: 'tokenBToPath',
            type: 'address[]',
          },
        ],
        internalType: 'struct LpSwapDetails[]',
        name: 'lpSwapDetails_',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'lpToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'minReturnAmount',
            type: 'uint256',
          },
          {
            internalType: 'address[]',
            name: 'nativeToToken0',
            type: 'address[]',
          },
          {
            internalType: 'address[]',
            name: 'nativeToToken1',
            type: 'address[]',
          },
        ],
        internalType: 'struct OutputLp',
        name: 'outputLpDetails_',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId_',
        type: 'uint256',
      },
    ],
    name: 'swapTokensToLp',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IAggregationExecutor',
            name: 'executor',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'contract IERC20',
                name: 'srcToken',
                type: 'address',
              },
              {
                internalType: 'contract IERC20',
                name: 'dstToken',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'srcReceiver',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'dstReceiver',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'minReturnAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'flags',
                type: 'uint256',
              },
            ],
            internalType: 'struct SwapDescription',
            name: 'desc',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'routeData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
        ],
        internalType: 'struct SwapDetails[]',
        name: 'data_',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId_',
        type: 'uint256',
      },
    ],
    name: 'swapTokensToTokens',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minReturnAmount',
            type: 'uint256',
          },
          {
            internalType: 'address[]',
            name: 'path',
            type: 'address[]',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
        ],
        internalType: 'struct UnoSwapDetails[]',
        name: 'swapData_',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId_',
        type: 'uint256',
      },
    ],
    name: 'unoSwapTokensToTokens',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'enum FeeType[]',
        name: 'feeTypes_',
        type: 'uint8[]',
      },
      {
        internalType: 'uint256[]',
        name: 'fees_',
        type: 'uint256[]',
      },
    ],
    name: 'updateProjectFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'feeVault_',
        type: 'address',
      },
    ],
    name: 'updateProjectFeeVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum FeeType[]',
        name: 'feeTypes_',
        type: 'uint8[]',
      },
      {
        internalType: 'uint256[]',
        name: 'fees_',
        type: 'uint256[]',
      },
    ],
    name: 'updateProtocolFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newProtocolFeeVault_',
        type: 'address',
      },
    ],
    name: 'updateProtocolFeeVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'routers_',
        type: 'address[]',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'isSupported',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
        ],
        internalType: 'struct Router[]',
        name: 'routerDetails_',
        type: 'tuple[]',
      },
    ],
    name: 'updateRouters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wNative',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
