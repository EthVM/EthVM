import {getBalance} from '../libs';
import {awaitableTimeout, randomAddress, randomValue} from "../libs/util";

const NUMBER_OF_ACCOUNTS = 100;

contract("Simple ether transfer", truffleAccounts => {

  it("should return ether balances that agree with the eth node", async () => {

    const accounts = [];

    for (let i = 0; i < NUMBER_OF_ACCOUNTS; i++) {
      accounts[i] = {
        address: randomAddress(),
        value: randomValue()
      };

      await web3.eth.sendTransaction({
        from: truffleAccounts[0],
        to: accounts[i].address,
        value: accounts[i].value
      });
    }

    const promises = accounts.map(async account => {

      const {address: to, value} = account;

      // send ether
      await web3.eth.sendTransaction({
        from: truffleAccounts[0],
        to, value
      });

      // wait 5 seconds to allow the block to be processed and then compare balance with parity
      return await awaitableTimeout(async () => {

        const ethvmBalance = await getBalance(to);
        const ethBalance = await web3.eth.getBalance(to);

        assert.equal(
          ethvmBalance.toString(), ethBalance.toString(),
          `Balance does not match`
        );

      }, 5000);

    });

    await Promise.all(promises);

  });
});
