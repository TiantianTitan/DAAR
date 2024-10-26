// hardhat.config.cjs
const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: "0.8.19",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
      accounts: [`0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`],
    },
  },
};
