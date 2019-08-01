const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const SelfDestruct = artifacts.require("SelfDestruct");
const SelfDestruct2 = artifacts.require("SelfDestruct2");
const SelfDestruct3 = artifacts.require("SelfDestruct3");

module.exports = function(deployer) {
  // MetaCoin
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);

  // SelfDestruct
  deployer.deploy(SelfDestruct, { value: "1000000000000000000" });

  // SelfDestruct2
  deployer.deploy(SelfDestruct2, {
    value: "22000000000000000000",
    gas: "800000"
  });
  deployer.deploy(SelfDestruct3, {
    value: "1000",
    gas: "3000000"
  });
};
