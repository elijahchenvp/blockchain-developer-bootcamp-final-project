// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const dotenv = require('dotenv');
// dotenv.config();
// const mnemonic = process.env.MNEMONIC;
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!at
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: "8545",
      network_id: "*"

    }
    // rinkeby: {
    //   provider: () => new HDWalletProvider("insert mnemonic", process.env.INFURA_URL),
    //   network_id: "4",
    //   gas: 5500000
    // }
    
  },

  compilers: {
    solc: {
      version: "^0.8.5",    // Fetch exact version from solc-bin (default: truffle's version)
      }
    }
};
