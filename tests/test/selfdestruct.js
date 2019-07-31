import { getAccountInfo } from "../libs";
import { generateAddress } from "ethereumjs-util";

const selfDestructContract = artifacts.require("SelfDestruct");
const selfDestructContract2 = artifacts.require("SelfDestruct2");

contract("SelfDestruct", truffleAccounts => {
  it("should acknowledge the simple selfdestruct", async () => {
    return new Promise(async resolve => {
      const instance = await selfDestructContract.deployed();
      await instance.destroy();
      setTimeout(async () => {
        const account = await getAccountInfo(instance.address);
        assert.equal("0", account.balance);
        resolve();
      }, 1000);
    });
  });

  it("should acknowledge the complex selfdestruct (ropsten version)", async () => {
    return new Promise(async resolve => {
      const instance = await selfDestructContract2.deployed();
      await instance.destroy();
      setTimeout(async () => {
        const mainAccount = await getAccountInfo(instance.address);
        assert.equal("0", mainAccount.balance);
        const sf1 = "0x" + generateAddress(instance.address, 1).toString("hex");
        const sf1Account = await getAccountInfo(sf1);
        assert.equal("0", sf1Account.balance);
        const sf2 = "0x" + generateAddress(instance.address, 2).toString("hex");
        const sf2Account = await getAccountInfo(sf2);
        assert.equal("0", sf2Account.balance);
        const sf3 = "0x" + generateAddress(instance.address, 3).toString("hex");
        const sf3Account = await getAccountInfo(sf3);
        assert.equal("9000000000000000000", sf3Account.balance);
        resolve();
      }, 1000);
    });
  });
});
