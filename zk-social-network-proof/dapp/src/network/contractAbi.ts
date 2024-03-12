export const contractAbi = [
  {
    inputs: [],
    name: "InvalidProof",
    type: "error",
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
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "claimScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
