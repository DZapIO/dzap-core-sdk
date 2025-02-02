import { Abi } from 'viem';

export const abi: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'governor_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wNative_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'feeVault_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'permit2_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'maxNoOfSwap_',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'HighFee',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HighPlatformFeeRatio',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidBlankSwap',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidInterval',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidLength',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMask',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNativeAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNoOfSwaps',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidPermit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidPermitData',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidPosition',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidRate',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidReturnAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSwapAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NativeTransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoAvailableSwap',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoChanges',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotWNative',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SwapCallFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnauthorizedCaller',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnauthorizedTokens',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroSwappedTokens',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
    ],
    name: 'AdminAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
    ],
    name: 'AdminRemoved',
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
        indexed: false,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes1',
        name: 'interval',
        type: 'bytes1',
      },
    ],
    name: 'BlankSwapped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isNative',
        type: 'bool',
      },
    ],
    name: 'Created',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'finalIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'noOfPositions',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool[]',
        name: 'isNative',
        type: 'bool[]',
      },
    ],
    name: 'CreatedBatched',
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
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startingSwap',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'finalSwap',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isNative',
        type: 'bool',
      },
    ],
    name: 'Modified',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'platformFeeRatio',
        type: 'uint256',
      },
    ],
    name: 'PlatformFeeRatioUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
    ],
    name: 'PositionOwnerUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
    ],
    name: 'SwapExecutorAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
    ],
    name: 'SwapExecutorRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint32[]',
        name: 'intervals',
        type: 'uint32[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'swapFee',
        type: 'uint256[]',
      },
    ],
    name: 'SwapFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint32[]',
        name: 'swapIntervals',
        type: 'uint32[]',
      },
    ],
    name: 'SwapIntervalsAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint32[]',
        name: 'swapIntervals',
        type: 'uint32[]',
      },
    ],
    name: 'SwapIntervalsRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'noOfSwaps',
        type: 'uint256',
      },
    ],
    name: 'SwapLimitUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'threshold',
        type: 'uint256',
      },
    ],
    name: 'SwapThresholdUpdated',
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
        name: 'rewardRecipient',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'swappedAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'receivedAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fee',
            type: 'uint256',
          },
          {
            internalType: 'bytes1',
            name: 'intervalsInSwap',
            type: 'bytes1',
          },
        ],
        indexed: false,
        internalType: 'struct SwapInfo[]',
        name: 'swapInformation',
        type: 'tuple[]',
      },
    ],
    name: 'Swapped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unswapped',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'swapped',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isNative',
        type: 'bool',
      },
    ],
    name: 'Terminated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
    ],
    name: 'TokensAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
    ],
    name: 'TokensRemoved',
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
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'swapped',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isNative',
        type: 'bool',
      },
    ],
    name: 'Withdrawn',
    type: 'event',
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
    inputs: [],
    name: 'MAX_PLATFORM_FEE_RATIO',
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
    name: 'NATIVE_TOKEN',
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
    name: 'PERMIT2',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes1',
        name: '',
        type: 'bytes1',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'accumRatio',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'activeSwapIntervals',
    outputs: [
      {
        internalType: 'bytes1',
        name: '',
        type: 'bytes1',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'accounts_',
        type: 'address[]',
      },
    ],
    name: 'addAdmins',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'tokens_',
        type: 'address[]',
      },
    ],
    name: 'addAllowedTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'executor_',
        type: 'address[]',
      },
    ],
    name: 'addSwapExecutors',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32[]',
        name: 'swapIntervals_',
        type: 'uint32[]',
      },
    ],
    name: 'addSwapIntervalsToAllowedList',
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
    name: 'admins',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allowedSwapIntervals',
    outputs: [
      {
        internalType: 'bytes1',
        name: '',
        type: 'bytes1',
      },
    ],
    stateMutability: 'view',
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
    name: 'allowedTokens',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data_',
        type: 'bytes[]',
      },
    ],
    name: 'batchCall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to_',
        type: 'address',
      },
      {
        internalType: 'bytes1',
        name: 'maskedInterval_',
        type: 'bytes1',
      },
    ],
    name: 'blankSwap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newGov',
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
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'swapInterval',
            type: 'uint32',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'noOfSwaps',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
        ],
        internalType: 'struct CreatePositionDetails[]',
        name: 'details_',
        type: 'tuple[]',
      },
    ],
    name: 'createBatchPositions',
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
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'swapInterval',
            type: 'uint32',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'noOfSwaps',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'permit',
            type: 'bytes',
          },
        ],
        internalType: 'struct CreatePositionDetails',
        name: 'details_',
        type: 'tuple',
      },
    ],
    name: 'createPosition',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeVault',
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
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
        ],
        internalType: 'struct Pair[]',
        name: 'pairs_',
        type: 'tuple[]',
      },
    ],
    name: 'getNextSwapInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'swappedAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'receivedAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fee',
            type: 'uint256',
          },
          {
            internalType: 'bytes1',
            name: 'intervalsInSwap',
            type: 'bytes1',
          },
        ],
        internalType: 'struct SwapInfo[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId_',
        type: 'uint256',
      },
    ],
    name: 'getPositionDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'swapInterval',
            type: 'uint32',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'swapsExecuted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'swapsLeft',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'swapped',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unswapped',
            type: 'uint256',
          },
        ],
        internalType: 'struct PositionInfo',
        name: 'positionInfo',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'interval_',
        type: 'uint32',
      },
    ],
    name: 'getSwapFee',
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
    name: 'maxNoOfSwap',
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
        name: 'positionId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'noOfSwaps_',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isIncrease_',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isNative_',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: 'permit_',
        type: 'bytes',
      },
    ],
    name: 'modifyPosition',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextToNextTimeThreshold',
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
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformFeeRatio',
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
        internalType: 'address[]',
        name: 'accounts_',
        type: 'address[]',
      },
    ],
    name: 'removeAdmins',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'tokens_',
        type: 'address[]',
      },
    ],
    name: 'removeAllowedTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'executor_',
        type: 'address[]',
      },
    ],
    name: 'removeSwapExecutors',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32[]',
        name: 'swapIntervals_',
        type: 'uint32[]',
      },
    ],
    name: 'removeSwapIntervalsFromAllowedList',
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
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
        ],
        internalType: 'struct Pair[]',
        name: 'pairs_',
        type: 'tuple[]',
      },
    ],
    name: 'secondsUntilNextSwap',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newVault_',
        type: 'address',
      },
    ],
    name: 'setFeeVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'platformFeeRatio_',
        type: 'uint256',
      },
    ],
    name: 'setPlatformFeeRatio',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32[]',
        name: 'intervals_',
        type: 'uint32[]',
      },
      {
        internalType: 'uint256[]',
        name: 'swapFee_',
        type: 'uint256[]',
      },
    ],
    name: 'setSwapFee',
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
            name: 'executor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenProxy',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
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
            internalType: 'bytes',
            name: 'swapCallData',
            type: 'bytes',
          },
        ],
        internalType: 'struct SwapDetails[]',
        name: 'data_',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'rewardRecipient_',
        type: 'address',
      },
    ],
    name: 'swap',
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
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes1',
        name: '',
        type: 'bytes1',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'swapAmountDelta',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes1',
        name: '',
        type: 'bytes1',
      },
    ],
    name: 'swapData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'performedSwaps',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nextAmountToSwap',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nextToNextAmountToSwap',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastSwappedAt',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'swapExecutors',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isNative_',
        type: 'bool',
      },
    ],
    name: 'terminatePosition',
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
    name: 'tokenMagnitude',
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
    name: 'totalCreatedPositions',
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
        name: 'positionId_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'newOwner_',
        type: 'address',
      },
    ],
    name: 'transferPositionOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'maxNoOfSwap_',
        type: 'uint256',
      },
    ],
    name: 'updateMaxSwapLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'nextToNextTimeThreshold_',
        type: 'uint256',
      },
    ],
    name: 'updateSwapTimeThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'userPositions',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes1',
        name: 'swapIntervalMask',
        type: 'bytes1',
      },
      {
        internalType: 'uint256',
        name: 'rate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'swapWhereLastUpdated',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startingSwap',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'finalSwap',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wNative',
    outputs: [
      {
        internalType: 'contract IWNative',
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
        internalType: 'uint256',
        name: 'positionId_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient_',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isNative_',
        type: 'bool',
      },
    ],
    name: 'withdrawPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
