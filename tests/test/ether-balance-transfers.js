import {awaitableTimeout, randomAddress, randomValue} from "../libs/util";
import {getBalance} from "../libs";
import {generateAddress} from "ethereumjs-util";
import {BigNumber} from "bignumber.js";

const NUMBER_OF_ACCOUNTS = 100;

contract("Ether balance transfers", truffleAccounts => {

  it("should handle simple ether transactions", async () => {

    const from = truffleAccounts[0];
    const accounts = [];

    for (let i = 0; i < NUMBER_OF_ACCOUNTS; i++) {
      accounts[i] = {
        address: randomAddress(),
        value: randomValue()
      };

      await web3.eth.sendTransaction({
        from,
        to: accounts[i].address,
        value: accounts[i].value
      });
    }

    const promises = accounts.map(async account => {

      const {address: to, value} = account;

      // wait 5 seconds to allow the block to be processed and then compare balance with parity
      return await awaitableTimeout(async () => {

        // TODO figure out how to do a point in time comparison of balance for from address

        const toEthvmBalance = await getBalance(to);
        const toEthBalance = new BigNumber(await web3.eth.getBalance(to), 10);

        assert.equal(
          new BigNumber(value).toString(), toEthvmBalance.toString(),
          'Value does not match ethvm balance'
        );

        assert.equal(
          toEthvmBalance.toString(), toEthBalance.toString(),
          `To address balance does not match. To = ${from}`
        );

      }, 5000);

    });

    await Promise.all(promises);

  });

  it("should handle contract self destruct with a self referencing refund address", async () => {

    const selfDestructContract = artifacts.require("SelfDestruct");

    const instance = await selfDestructContract.deployed();
    const { address } = instance;

    await instance.destroy();

    await awaitableTimeout(async () => {

      const ethBalance = await web3.eth.getBalance(address);
      const ethvmBalance = await getBalance(address);

      assert.equal(ethBalance.toString(), ethvmBalance.toString(), 'Balances do not match');

    }, 5000);

  });

  it("should handle sending ether to a contract after it has self destructed within the same tx", async () => {

    const selfDestructContract2 = artifacts.require("SelfDestruct2");

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
