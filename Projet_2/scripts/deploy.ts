import { ethers } from "hardhat";

async function main() {
  // 获取合约工厂
  const Collection = await ethers.getContractFactory("Collection");
  
  // 部署合约
  const collection = await Collection.deploy("My NFT Collection", 100);
  
  // 等待合约部署完成
  await collection.deployed();
  
  console.log("合约部署成功，地址为:", collection.address);
}

// 捕获部署过程中的错误
main().catch((error) => {
  console.error("部署失败:", error);
  process.exitCode = 1;
});
