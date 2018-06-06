<div align="center">
  <a href="https://raw.githubusercontent.com/enKryptIO/ethvm/master/LICENSE.md">
    <img alt="License" src="https://img.shields.io/dub/l/vibe-d.svg">
  </a>
  <a href="https://travis-ci.org/enKryptIO/ethvm" target="_blank">
    <img alt="Travis" src="https://travis-ci.org/enKryptIO/ethvm.svg?branch=master" />
  </a>
  <a href="https://codecov.io/gh/enKryptIO/ethvm" target="_blank">
    <img alt="codecov" src="https://codecov.io/gh/enKryptIO/ethvm/branch/master/graph/badge.svg" />
  </a>
  <a href="https://david-dm.org/enKryptIO/ethvm" target="_blank">
    <img alt="Dependency Status" src="https://david-dm.org/enKryptIO/ethvm.svg" />
  </a>
  <a href="https://david-dm.org/enKryptIO/ethvm?type=dev" target="_blank">
    <img alt="devDependency Status" src="https://david-dm.org/enKryptIO/ethvm/dev-status.svg" />
  </a>
</div>

<div align="center">
  <h1>
    <img width="100%" heigth="100%" src="https://raw.githubusercontent.com/enKryptIO/ethvm/master/assets/logo.png" alt="ethvm-logo">
    <p>EthVM</p>
  </h1>
</div>

# EthVM - Ethereum Blockchain Explorer

Open source realtime blockchain explorer, powered by [Vue.js](https://github.com/vuejs/vue) / [go-ethereum](https://github.com/ethereum/go-ethereum) / [RethinkDB](https://github.com/rethinkdb/rethinkdb)/[Socket.io](https://github.com/socketio/socket.io) / [Redis](https://redis.io/topics/quickstart)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing puposes.

### Prerequisites

There are two ways to develop on EthVm:

1.  Using `docker`
2.  Manual method

So, choose your own path depending on which experience you want to have (keep in mind that using `docker` and `docker-compose` will streamline a lot the different dependencies you need in order to have a proper setup, so, if you want to start developing ASAP, using `docker` will be a better choice).

### Developing using Docker

Make sure you have installed `docker` and `docker-compose`.

In order to bring up the project you can issue the following command in the terminal (these are regular `docker-compose` commands, nothing fancy):

```sh
$ docker-compose up -d
```

To stop:

```sh
$ docker-compose stop
```

To delete built docker images:

```sh
$ docker-compose rm
```

And to check the logs:

```sh
$ docker-compose logs -f
```

If you take a look at the `docker-compose.yml` file, you will discover the following:

* It's using [traefik](https://traefik.io/) to route traffic. So, if you have configured dnsmasq (instructions for [OSX](https://gist.github.com/ogrrd/5831371) or [Linux](https://wiki.archlinux.org/index.php/dnsmasq)) to resolve `.lan` domain you can reach ethvm at `http://ethvm.lan`. The same applies to `http://rethink.dashboard.ethvm.lan` (this will allow to visit directly RethinkDB's admin dashboard) or `http://geth.ethvm.lan`. Also, it exports properly the ports so you can hose the usual `http://localhost:<port>`.
* By default, it creates a private ethereum network and it starts in mining mode. This will ensure you'll have everything quiet without the need to download the whole main ethereum blockchain (or even the testnet). So, if you want to send real transactions, I recommend you to use Postman and send an `eth_sendRawTransaction` (there's a [Postman collection related to ethereum here](https://documenter.getpostman.com/view/4117254/ethereum-json-rpc/RVu7CT5J))

### Developing without Docker (Manual Installation)

#### Prerequisites

What things you need to install the software and how to install them:

1- Make sure you have golang at least 1.9 and build tools. [Installation instructions](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu#building-from-source).
2- Install RethinkDB on your local system. [Installation instructions](https://www.rethinkdb.com/docs/install/)
3- Install Redis DB on your local system. [Installation instructions](https://redis.io/topics/quickstart)

#### Cloning dependencies

Clone our modified go-ethereum github repo:

```sh
$ git clone https://github.com/enKryptIO/go-ethereum.git
```

Clone the EthVM github repo:

```sh
$ git clone https://github.com/enKryptIO/ethvm.git
```

Clone the ethvm-socket-server github repo:

```sh
$ git clone https://github.com/enKryptIO/ethvm-socket-server.git
```

### Building go-ethereum

Follow proper instructions for your OS, but usually, if you're using OSX or Linux you can issue the following command (inside go-ethereum folder):

```sh
$ make geth
```

Make sure it builds without any problems.

## Running

Set following environmental variables:

```sh
#!/usr/bin/env bash
export RETHINKDB_URL="rethinkdb://localhost:28015"
export REDIS_URL="127.0.0.1:6379"
export RETHINKDB_CERT_RAW=""
export RPC_HOST="localhost"
export RPC_PORT="8545"
```

Start rethinkdb:

```sh
$ rethinkdb
```

Start geth:

```sh
$ go-ethereum/build/bin/geth --ethvm --rpc --gcmode archive
```

Start ethvm-socket-server:

```sh
$ cd ethvm-socket-server
$ npm start
```

Start ethvm:

```sh
$ cd ethvm
# edit /src/configs/socket.json and change the `url` value to `http://localhost`
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
