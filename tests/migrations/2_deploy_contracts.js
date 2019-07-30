const ConvertLib = artifacts.require("ConvertLib")
const MetaCoin = artifacts.require("MetaCoin")
const SelfDestruct = artifacts.require('SelfDestruct')

module.exports = function(deployer) {
  // MetaCoin
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)

  // SelfDestruct
  deployer.deploy(SelfDestruct, {value: '1000000000000000000'})
}
