import {getAccountInfo, getBalance} from "../libs";
import { generateAddress } from "ethereumjs-util";
import {awaitableTimeout} from "../libs/util";

const selfDestructContract = artifacts.require("SelfDestruct");
const selfDestructContract2 = artifacts.require("SelfDestruct2");

contract("Ether Destruction", truffleAccounts => {

  it("should correctly handle contract self destruct with a self referencing refund address", async () => {

    const instance = await selfDestructContract.deployed();
    const { address } = instance;

    await instance.destroy();

    await awaitableTimeout(async () => {

      const ethBalance = await web3.eth.getBalance(address);
      const ethvmBalance = await getBalance(address);

      assert.equal(ethBalance.toString(), ethvmBalance.toString(), 'Balances do not match');

    }, 5000);

  });

  it("should correctly handle sending ether to a contract after it has self destructed within the same tx", async () => {

    const instance = await selfDestructContract2.deployed();
    const {address: parentAddress } = instance;

    await instance.destroy();

    await awaitableTimeout(async () => {

      const parentEthvmBalance = await getBalance(parentAddress);
      const parentEthBalance = await web3.eth.getBalance(parentAddress);

      assert.equal(parentEthvmBalance.toString(), '0', 'Parent balance should be 0');
      assert.equal(parentEthvmBalance.toString(), parentEthBalance, 'Parent balance should match eth balance');

      for(let i =1; i<=3; i++) {

        const childAddress = generateAddress(parentAddress, i).toString('hex');

        const childEthvmBalance = await getBalance(childAddress);
        const childEthBalance = await web3.eth.getBalance(childAddress);

        assert.equal(childEthvmBalance.toString(), '0', `Child balance should be 0. Address = ${childAddress}`);
        assert.equal(childEthvmBalance.toString(), childEthBalance, `Child balance should match eth balance. Address = ${childAddress}`);

      }

    }, 5000);

  });
});
