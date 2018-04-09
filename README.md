# EthVM - Ethereum blockchain explorer

Open source realtime blockchain, powered by [vue.js](https://github.com/vuejs/vue)/[go-ethereum](https://github.com/ethereum/go-ethereum)/[rethinkdb](https://github.com/rethinkdb/rethinkdb)/[socket.io](https://github.com/socketio/socket.io)/[Redis](https://redis.io/topics/quickstart)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing puposes.

### Prerequisites

What things you need to install the software and how to install them

```
Make sure you have golang 1.9^ and build tools
```
[Ubuntu Instructions](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu#building-from-source)
```
Install rethinkdb on your local system
```
[Instruction on how to install rethinkdb](https://www.rethinkdb.com/docs/install/)
```
Install redisDB on your local system and make sure it is running
```
[Install RedisDB](https://redis.io/topics/quickstart)
### Installing

Clone the go-ethereum github repo
```
git clone https://github.com/enKryptIO/go-ethereum.git
```
Clone the ethvm github repo
```
git clone https://github.com/enKryptIO/ethvm.git
```
Clone the ethvm-socket-server github repo
```
git clone https://github.com/enKryptIO/ethvm-socket-server.git
```

### Building go-ethereum

ubuntu instructions
```
cd go-ethereum
make geth
```

Make sure it builds without any problems

## Running

Start rethinkdb
```
rethinkdb
```
Start geth
```
go-ethereum/build/bin/geth --ethvm --rpc
```
Set following environmental variables
```
#!/usr/bin/env bash
export RETHINKDB_URL="rethinkdb://localhost:28015"
export REDIS_URL="127.0.0.1:6379"
export RETHINKDB_CERT_RAW=""
export RPC_HOST="localhost"
export RPC_PORT="8545"
```
Start ethvm-socket-server
```
cd ethvm-socket-server
npm run compose
```
Start ethvm
```
cd ethvm
edit /src/configs/socket.json and change the `url` value to `http://localhost`
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details