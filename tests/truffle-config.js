require("@babel/register")
require("@babel/polyfill")
const HDWalletProvider = require("truffle-hdwallet-provider")

module.exports = {
  networks: {
    //https://wiki.parity.io/Private-development-chain
    development: {
      provider: () =>
        new HDWalletProvider(
          [
            "4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7",
            "1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            "50799ecf6c188edbfa8711124e66a9ca13a538454050f8bbb840d9d7a34d5808",
            "c449d46c0927d6ccf3a5bd4dde3b980d274a2c8bd6dcea11ae1bbc97c2351657",
            "cfdd3dbe8c16444987ac720160a8d211274e9362b0114177bbd20d19176de39b"
          ],
          "http://localhost:8545",
          0,
          1
        ),
      network_id: 0x11, // Custom network
      gasPrice: 20000000000, // 20 gwei (in wei) (default: 100 gwei)
      from: "0x00a329c0648769a73afac7f9381e08fb43dbea72" // Account to send txs from (default: accounts[0])
    }
  },
  mocha: {
    timeout: 100000
  },
  compilers: {
    solc: {
      version: "0.5.1",
      docker: false,
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    }
  }
}
