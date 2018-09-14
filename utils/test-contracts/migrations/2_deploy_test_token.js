var TestToken = artifacts.require('./TestToken.sol')

module.exports = function(deployer) {
  deployer.deploy(TestToken)
}
