import { viem } from "hardhat";

async function main() {
  const easAddress = "0xaEF4103A04090071165F78D45D83A0C0782c2B2a";
  const schemaUID = "0xbf8a96f0b0c5d6178578c5226af9889f50439f4cd37c84106bca3b463e4132d5";
  const verifierAddress = "0x5c4e9f5ee935cbc83a7dc948e7a5d3442d4256ba";
  // const verifierAddress = "0xEB357c02d14fe29ce9a216722805384bc647aaa3";

  const socialProof = await viem.deployContract(
    "SocialProof",
    [verifierAddress, easAddress, schemaUID]
  );

  console.log(
    `SocialProof deployed to ${socialProof.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
