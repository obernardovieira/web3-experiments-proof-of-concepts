export const contractAbi = [
  {
    inputs: [],
    name: "InvalidEAS",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidProof",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "identifier",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "network",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "score",
        type: "uint8",
      },
    ],
    name: "SetUnassignedScore",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_identifier",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_network",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_score",
        type: "uint8",
      },
    ],
    name: "setScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
