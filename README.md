<div align="center">
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/logo.png" alt="ethvm-logo" width="200">
  <p>:zap: ethVM: An Open Source Block Explorer for Ethereum with Users In Mind :zap:</p>
  <p>Powered by <a href="https://www.typescriptlang.org/">TypeScript</a> / <a href="https://vuejs.org/">VueJS</a>
</div>

![Screenshot example](.github/assets/capture-1.png)

<p align="center">
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-1.png" width="100" />
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-2.png" width="100" />
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-3.png" width="100" />
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-4.png" width="100" />
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-5.png" width="100" />
</p>

## About

### What is ethVM?

ethVM is an Ethereum Blockchain Data Processing and Analytics Engine with an open-source and client-side Block Explorer developed by the team at MyEtherWallet. It is secured under the SSPL license (a variation of the GNU Affero License v3).

While ethVM is currently launched for Ethereum, it was created with the intention of supporting multiple chains.


## Currently Supported Networks:

- Ethereum Mainnet - [ethVM.com](https://www.ethvm.com/)
- Sepolia Testnet - [sepolia.ethVM.com](https://sepolia.ethvm.com/)


## Core infrastructure

Our core infrastructure is based on well known languages:

- [TypeScript](https://www.typescriptlang.org/) (Block Explorer)
- Javascript (API/Processor)

And also is backed by popular frameworks:

- [VueJs](https://vuejs.org/)
- [Apollo Graphql](https://www.apollographql.com/)

If you have any questions or requests, please feel free to open an issue or send us an email at *dev@ethvm.com*.


## Getting Started
You can run Sepolia front end locally, you will need:

*Prerequisites*
- Node version 18.0.0
- pnpm version 8.10.5
- pnpm, [installation guide](https://pnpm.io/installation). 

1. Open terminal
2. Clone the repo: git clone git@github.com:https://github.com/EthVM/EthVM.git
3. run `cd v2`. Note that front end codebase files are located under v2 folder at this momoment.
4. Create local .env file:
  `nano ./.env `
  
  add the following variables to the file:
  ```
  NODE_ENV=development
  VUE_APP_NETWORK='SEPOLIA'
  VUE_APP_PUBLIC_URL='sepolia.ethvm.com/'
  VUE_APP_HTTP_LINK=https://sepolia-api-v2.ethvm.dev
  VUE_APP_WS_CLIENT=wss://sepolia-apiws-v2.ethvm.dev
  ```
  
5. run `pnpm install` to install node packages
6. run `pnpm serve`. 
App should be running in https://localhost:8080


## Contributing

We welcome and encourage every kind of contribution to ethVM, so, please see [CONTRIBUTING](.github/CONTRIBUTING.md) for more details on how to proceed.

## Stay in touch!

We have created our [Discord channel](https://discord.gg/eAjufBYX4r), feel free to join and collaborate!
You can also reach out to us on [Twitter](https://twitter.com/Eth_VM) and [Reddit](https://www.reddit.com/r/ethvm/).


## About [MyEtherWallet](https://github.com/MyEtherWallet) Inc

ethVM is created and supported by the team at MyEtherWallet (MEW).

MyEtherWallet is Ethereum’s original wallet and has been in continuous operation since 2015. The MEW team is a group of crypto-enthusiasts dedicated to building open-source, beautiful and intuitive products that people and communities actually use. Our team is committed to protecting user privacy. We created tools that allow users to view and interact with their funds, while having confidence that they are the only ones with access to their data. without having to worry about who has access to their information and data.

All of our products are completely open-source and available on GitHub for review:

[MyEtherWallet Inc](https://github.com/MyEtherWallet/MyEtherWallet)

[Enkrypt](https://github.com/enkryptcom/enKrypt)

## License

This project is licensed under the SSPL License (a small variation of the GNU Affero License v3) - see the [LICENSE](LICENSE) file for details ([or read it here online](https://www.mongodb.com/licensing/server-side-public-license)).

<div align="center">
  <img src="https://raw.githubusercontent.com/EthVM/EthVM/develop/.github/assets/powered-by-MEW.png" alt="Powered by MEW"  width="150"/>
</div>
