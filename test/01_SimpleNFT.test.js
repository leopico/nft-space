const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("SimpleNFT", function () {
  async function runEveryTime() {
    const amount = ethers.utils.parseUnits("0.0001", 18);
    const mintAmount = amount.toNumber();
    // console.log(mintAmount);
    const _root =
      "0x95800dbdbfca87bade7f6f053c930284a30ad73f80fc424f49080ccb2522212d";
    //it come from Merkle tree proof
    const proof = [
      "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
      "0x989fd38a078108545a017d7982884820cac018bf114e6ef2f3c97d89ce727c62",
      "0xfbf6932f2425703c6021cb85257c6a0c19c383c7e306dcfca95c3bae537f7ec5",
    ];
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
    const simpleNft = await SimpleNFT.deploy();
    await simpleNft.deployed();
    return { mintAmount, owner, user1, user3, user2, simpleNft, _root, proof };
  }

  describe("can mint an nft with whitelisting and sale state", function () {
    it("can mint an nft with whitelisting", async function () {
      const { simpleNft, user1, mintAmount, _root, proof } = await loadFixture(
        runEveryTime
      );

      await simpleNft.setRoot(_root);
      await simpleNft.flipPreSaleState();
      await simpleNft.flipWhitelistingState();
      await simpleNft
        .connect(user1)
        .mintToken([1], proof, { value: mintAmount });
    });
    it("can mint an nft with sale state", async function () {
      const { simpleNft, user2, mintAmount } = await loadFixture(runEveryTime);
      await simpleNft.flipSaleState();
      await simpleNft.connect(user2).mintToken([1], [], { value: mintAmount });
    });
    it("can not mint with not whitelist address at whitelisting stage", async function () {
      const { simpleNft, user3, mintAmount, _root } = await loadFixture(
        runEveryTime
      );
      await simpleNft.setRoot(_root);
      await simpleNft.flipPreSaleState();
      await simpleNft.flipWhitelistingState();
      await expect(
        simpleNft.connect(user3).mintToken([1], [], { value: mintAmount })
      ).to.be.revertedWith("Address not whitelisted");
    });
    it("should same with MAX_TOKENS", async function () {
      const { simpleNft } = await loadFixture(runEveryTime);
      expect(await simpleNft.MAX_TOKENS()).to.equal(20);
    });
  });

  runEveryTime();
});
