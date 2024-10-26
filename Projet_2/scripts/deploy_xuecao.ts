import { ethers } from "hardhat";

async function main() {
  const initialSupply = ethers.utils.parseUnits("1000000", 18); // 100万个 XUECAO
  const XueCao = await ethers.getContractFactory("XueCaoToken");
  const xuecao = await XueCao.deploy(initialSupply);

  await xuecao.deployed();

  console.log("XueCaoToken deployed to:", xuecao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
