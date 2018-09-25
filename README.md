<div align="center">
  <img src="https://raw.githubusercontent.com/enKryptIO/ethvm/master/.github/assets/logo.png" alt="ethvm-logo">
  <p>:zap::zap::zap: EthVM Project: An open source blockchain explorer for Ethereum networks :zap::zap::zap:</p>
  <p>Powered by <a href="https://www.typescriptlang.org/">TypeScript</a> / <a href="https://github.com/socketio/socket.io">Socket.io</a> / <a href="https://github.com/ethereum/go-ethereum">go-ethereum</a> / <a href="https://github.com/rethinkdb/rethinkdb">RethinkDB</a> / <a href="https://redis.io/topics/quickstart">Redis</a></p>
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

## Project Structure

This repository holds a mirage of different subprojects that in conjuction forms EthVM (we are following the [monorepo](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9) way of living). All the projects are located under `apps/` folder:

| Directory               | Written in | Purpose                                                                                                                                                                                                                                                                     |
|:------------------------|:-----------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `apps/ethvm`            | VueJs      | Main frontend website where users navigate to explore the Blockchain.                                                                                                                                                                                                       |
| `apps/server`           | NodeJs     | A Socket reactive API that the frontend uses to communicate with the Blockchain.                                                                                                                                                                                            |
| `apps/eth`              | Go         | A forked version of [`go-ethereum`](https://github.com/enKryptIO/go-ethereum) that processes / listens to Ethereum events. This project is kept as a `git sumbodule` as it will connstantly be updated as main changes are introduced in the main branch of `go-ethereum`.  |
| `apps/bolt`             | Kotlin     | More info soon...                                                                                                                                                                                                                                                           |

Also, there are a couple of different directories, not related itself to any concrete subproject, that lives in the parent one:

| Directory               | Written in          | Purpose                                                                                                                                                                                                                                    |
|:------------------------|:--------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `provisioners`          | Kubernetes / Docker | Contains kubernetes definitions for deploying a production ready EthVM project (work in progress, though). Also, it contains `docker` development images (that differs slightly from production ready dockerfiles) needed for development. |
| `bin`                   | NodeJs              | Contains helper scripts that aids in different aspects. For now, there's only one script called `monkey-cli` that helps to produce fake blocks / txs and contract deployments for testing purposes. More utils will come eventually.        |
| `postman`               | Postman (Js)        | A simple Postman collection that contains all `ethereum` JSON RPC calls.                                                                                                                                                                   |
| `docker-compose.yml`    | Docker              | For keeping everything sane and to produce a replicable environment in all machines, we use `docker` and `docker compose` as our development orchestrator.                                                                                 |

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing puposes.

### Prerequisites

#### Develop with Go-Ethereum enabled

This step is optional, as everything is self contained properly in our `docker-compose.yml` file but, If you're planning to work on our [`go-ethereum`](https://github.com/enKryptIO/go-ethereum) fork during development then, we recommend you to clone the project like below (we are using git submodules for `go-ethereum`):

```sh
$ git clone --recursive https://github.com/enKryptIO/ethvm.git
```

Otherwise, if you have already cloned it without specifying --recursive flag, just issue the following command in the terminal (it will fetch everything):

```sh
# in parent ethvm folder
$ git submodule init
$ git submodule update
```

After everything is cloned, just double check and be sure that `go-ethereum` submodule is tracking properly `master` branch (or whatever one you want to work with).

The last part, is to enable proper building of `geth` image in `docker`. So, comment / uncomment these lines in `docker-compose.yml` file:

```yaml

geth_miner:
    # image: enkryptio/go-ethereum:latest
    build:
      context: ./apps/eth

geth:
    # image: enkryptio/go-ethereum:latest
    build:
      context: ./apps/eth

```

#### Setup a local DNS (or edit /etch/hosts file)

Internally, this `docker-compose.yaml` uses the great and the mighty [`traefik`](https://traefik.io/) as a frontend proxy. By default and for convenience, all of the services are exposed under the fake local domain `.lan`.

So, we recommend you to have a local DNS service like `DNSmasq` (instructions for [OSX](https://gist.github.com/ogrrd/5831371), [Linux](https://wiki.archlinux.org/index.php/dnsmasq) or [Windows](http://www.orbitale.io/2017/12/05/setup-a-dnsmasq-equivalent-on-windows-with-acrylic.html)) to resolve custom domains and to have access directly to exposed services with `.lan` domain.

Another different and classical approach is to edit and add these entries to `/etc/hosts` file, just like this (if you're using Windows 10, adapt accordingly):

```sh
127.0.0.1       geth.ethvm.lan
127.0.0.1       rethink.ethvm.lan
127.0.0.1       rethink.dashboard.ethvm.lan
127.0.0.1       ws.ethvm.lan
127.0.0.1       redis.ethvm.lan
127.0.0.1       ethvm.lan
```

### Windows 10 support

We're working hard to have support to other operating systems besides the usual suspects like `Linux` and `Mac OS`, so `Windows 10` is not an exception.

Although, there are some caveats you need to know in order to have a working environment, for now, we have detected the following issues (if you find another one, create an issue and we will try to help you):

- **traefik**: The image uses a shared mounted volume, depending on the installed version you have of `docker`, it may not init properly. [In this thread here's the solution](https://github.com/docker/for-win/issues/1829), basically, if you use PowerShell, set the environment variable to `$Env:COMPOSE_CONVERT_WINDOWS_PATHS=1`.
- **go-ethereum**: `Docker` doesn't build properly the image [(reason here)](https://github.com/ethereum/go-ethereum/issues/16828). To solve it, for now, you have to replace all `CRLF (\r\n)` characters with `LF (\n)` characters in the file `build/env.sh` (more information on the previous issue link).

## Developing

Now that you have done sucessfully the prerequisites steps (yay!), it's time to get your hands dirty. Just make sure you have installed [`docker`](https://docs.docker.com/install/) and [`docker-compose`](https://docs.docker.com/compose/install/) (we are using `18.06.1-ce` and `1.22.0` versions, respectively).

In order to bring up the project, issue the following command in the terminal:

```sh
$ docker-compose up -d
```

The very first time you fire this command, it will start building the whole docker images for `ethvm`, `server` and optionally `go-ethereum` (so the boot time will take several minutes and the CPU will start doing heavy work!).

If you want to finish your development session, just write the following:

```sh
$ docker-compose stop
```

To delete built docker images:

```sh
$ docker-compose rm -s
```

To delete everything:

```sh
$ docker-compose down -v --remove-orphans --rmi all
```

And to check logs:

```sh
# this is for all services
$ docker-compose logs -f 

# or you can specify the service name defined in docker-compose to read specific logs
$ docker-compose logs -f ethvm 
$ docker-compose logs -f server
$ docker-compose logs -f geth
# ... 
```

As you can see, these are just regular `docker-compose` commands, so, if you have any related questions to this, navigate to the [official documentation](https://docs.docker.com/compose/) as it will cover basic and advanced stuff.

## Contributing

We welcome every kind of contribution, so, please see [CONTRIBUTING](.github/CONTRIBUTING.md) for more details on how to proceed.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

<div align="center">
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="built with love by enKryptIO team" />
</div>
