# monkeycli

Ethereum utility to Generate random transactions
 
### Usage

#### Step 1 
Deploy ERC20 token contract

```sh
$ npm run monkey deploy
```
#### Step 2     
Check if contract is deployed and get contract address 
npm run monkey txdetail <txhash>

```sh
$ npm run monkey txdetail 0xe17c0b51510dac4aa8f06f51db040d5e9f0c5af4371b875cdd8d964ee34fc554
```

####  step 3 

start generating random txs
npm run monkey start <contractaddress>

```sh
$ npm run monkey start  0xee24211fe08d46419e3bdf2d910e0b23fe5302f2
```
