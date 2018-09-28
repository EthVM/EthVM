<div align="center">
  <img src="https://raw.githubusercontent.com/enKryptIO/ethvm/master/.github/assets/logo.png" alt="ethvm-logo">
  <p>:zap::zap::zap: EthVM Project: An open source blockchain explorer for Ethereum networks :zap::zap::zap:</p>
  <p>Powered by <a href="https://www.typescriptlang.org/">TypeScript</a> / <a href="https://github.com/socketio/socket.io">Socket.io</a> / <a href="https://github.com/ethereum/go-ethereum">go-ethereum</a> / <a href="https://kafka.apache.org/">Kafka</a> / <a href="https://github.com/mongodb/mongo">MongoDB</a> / <a href="https://redis.io/topics/quickstart">Redis</a></p>
</div>

# EthVM: Ethereum Blockchain Explorer

![Screenshot example](.github/assets/ethvm.png)

## WARNING

Currently we're working on re-architecting all the stack to be Kafka centric (removing RethinkDB in the process) and opening new processors and platforms to where store data. All work is being done on `feature/bolt-setup` branch. Proper instructions will be eventually written in the Wiki as soon as we find those changes stable enough to be merge back also to `master` branch.

## Philosophy

We have strong foundations on how an Open Source explorer should be:

- **Empower the people**: Give people the ability to inspect the Ethereum blockchain (and other related networks) easily, pretty much like [etherscan](https://etherscan.io/) does (but without being closed source).
- **Open source & audit-able**: Having an open source foundation, will guarantee free access to inspect, audit and modify whatever you want or need, without any vendor lock-in.
- **People are the Priority**: People are the most important & their experience trumps all else. If monetization worsens the experience, we don't do it. (e.g. ads).
- **A learning experience, too**: We want to educate about Ethereum, security, privacy, the importance of controlling your own keys, how the blockchain works, and how Ethereum and blockchain technologies enable a better world.
- **Private**: No tracking!!! No emails. No ads. No demographics. We don't even know who / what / where you are.

## EthVM Project Structure

This repository holds a mirage of different subprojects that in conjuction forms EthVM (we are following the [monorepo](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) way of living). All of them are located under `apps/` folder:

| Directory               | Written in | Purpose                                                                                                                                                                                                                                                                     |
|:------------------------|:-----------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `apps/avro-schemas`     | Avro       | A set of Avro schemas that are used mainly as a models in the forked version of `go-ethereum` and `Bolt`.                                                                                                                                                                   |
| `apps/bolt`             | Kotlin     | A Kafka Streams blockchain processing application (EthVM core element).                                                                                                                                                                                                     |
| `apps/contracts`        | Solidity   | A set of contracts that helps to obtain tokens balances for a particular address.                                                                                                                                                                                           |
| `apps/ethereumj`        | Java       | A forked version of [`ethereumj`](https://github.com/enKryptIO/ethereumj) that processes / listens to Ethereum events. This project is kept as a `git sumbodule` as it will connstantly be updated as main changes are introduced in the main branch of `ethereumj`.        |
| `apps/ethvm`            | VueJs      | Main frontend website where users navigate to explore the Blockchain.                                                                                                                                                                                                       |
| `apps/server`           | NodeJs     | A Socket reactive API that the frontend uses to communicate with the Blockchain.                                                                                                                                                                                            |

Also, there are a couple of different directories, not related itself to any concrete subproject, that lives in the parent one:

| Directory                    | Written in          | Purpose                                                                                                                                                                                                                                        |
|:-----------------------------|:--------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `bin`                        | NodeJs / Bash       | Contains helper scripts that aids in different aspects of the development. Also, there's one script called `monkey-cli` that helps to produce fake blocks / txs and contract deployments for testing purposes.                                 |
| `postman`                    | Postman (Js)        | A simple Postman collection that contains all `ethereum` JSON RPC calls. Very useful for testing our custom geth node.                                                                                                                         |
| `provisioners`               | Kubernetes / Docker | Contains kubernetes definitions for deploying a production ready EthVM project (work in progress, though). Also, it contains `docker` development images (that differs slightly from production ready `dockerfiles`) needed for development.   |
| `utils`                      | Js, Solidity...     | This folder contains the source code of `monkey-cli`. Also, it contains `Solidity` contracts for testing our `interal-transaction-tracer` inside `go-ethereum`.                                                                                |
| `docker-compose.yml`         | Docker              | This `docker-compose` file contains everything needed to setup a private environment ready for developing.                                                                                                                                     |
| `docker-compose.ropsten.yml` | Docker              | Same as above but giving support to `ropsten` network.                                                                                                                                                                                         |

## Getting Started

For more information on how you can setup your environment, visti our [Wiki](https://github.com/enKryptIO/ethvm/wiki/) for more information.

## Contributing

We welcome every kind of contribution, so, please see [CONTRIBUTING](.github/CONTRIBUTING.md) for more details on how to proceed.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

<div align="center">
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="built with love by enKryptIO team" />
</div>
