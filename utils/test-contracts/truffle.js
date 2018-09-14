/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // contracts_build_directory: './output',
  networks: {
    dev: {
      host: 'localhost',
      port: 8545,
      network_id: '1234',
      gas: 4500000,
      gasPrice: 10000000000,
      from: '0x84baabad835e6ca9252658cd6eae0152f6330c09'
    }
  }
}
