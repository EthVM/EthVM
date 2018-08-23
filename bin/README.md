# monkey-cli

Ethereum utility to generate random transactions that aids in testing.

## Usage

### Step 1

Deploy ERC20 sample token contract

```sh
$ yarn monkey deploy
```

### Step 2

Check if contract is deployed and get contract address:

```sh
# yarn monkey txdetail <txhash>
$ yarn monkey txdetail 0xe17c0b51510dac4aa8f06f51db040d5e9f0c5af4371b875cdd8d964ee34fc554
```

### step 3

Start generating random txs:

```sh
# yarn monkey start <contractaddress>
$ yarn monkey start 0xee24211fe08d46419e3bdf2d910e0b23fe5302f2
```
