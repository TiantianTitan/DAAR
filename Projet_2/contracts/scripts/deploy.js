const hre = require("hardhat");

async function main() {
    // Deploy Collection contract
    const Collection = await hre.ethers.getContractFactory("Collection");
    const collection = await Collection.deploy("MyCollection", hre.ethers.utils.parseEther("0.05"));
    await collection.deployed();
    console.log("Collection deployed to:", collection.address);

    // Deploy Booster contract
    const Booster = await hre.ethers.getContractFactory("Booster");
    const booster = await Booster.deploy(hre.ethers.utils.parseEther("0.1"), collection.address);
    await booster.deployed();
    console.log("Booster deployed to:", booster.address);

    // Set Booster address in Collection contract
    await collection.setBoosterAddress(booster.address);
    console.log("Booster address set in Collection contract");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in deployment:", error);
        process.exit(1);
    });
