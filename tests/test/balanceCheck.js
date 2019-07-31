import { getAccountInfo } from "../libs";

const NUMBER_OF_ACCOUNTS = 100;

const randomAddress = () => {
  var result = "";
  var characters = "abcdef0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 40; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return "0x" + result;
};

const randomValue = () => {
  return Math.floor(Math.random() * 10000000000000);
};

contract("CheckAccountBalance", truffleAccounts => {
  it("Should get correct account balances", async () => {
    return new Promise(async resolve => {
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
      setTimeout(async () => {
        for (const account of accounts) {
          const _account = await getAccountInfo(account.address);
          assert.equal(
            account.value,
            _account.balance,
            `account balance: ${
              account.value
            } doesnt match with ethvm balance: ${_account.balance} on account ${
              account.address
            }`
          );
        }
        resolve();
      }, 4000);
    });
  });
});
