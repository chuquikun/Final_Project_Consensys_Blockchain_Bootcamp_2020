
const path = require("path");
const HDWallet = require('@truffle/hdwallet-provider');
const fs = require('fs');

const PROJECT_ID= fs.readFileSync(".projectId").toString().trim();
const MNEMONIC = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: () => new HDWallet(MNEMONIC, `https://ropsten.infura.io/v3/${PROJECT_ID}`),
      network_id: 3,
      gas: 5500000 // Gas limit used for deploys
    }
  },
  compilers: {
    solc: {
      version: "0.6.2",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      },
      evmVersion: "byzantium"
    }
  }
};