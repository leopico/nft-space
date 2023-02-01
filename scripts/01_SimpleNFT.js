const hre = require("hardhat");

async function main() {
  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const simpleNft = await SimpleNFT.deploy();

  await simpleNft.deployed();

  console.log(`deployed to contract at ${simpleNft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
