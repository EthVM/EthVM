<div align="center">
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/master/.github/assets/logo.png" alt="ethvm-logo">
  <p>:zap: EthVM: An Open Source Proccessing Engine and Block Explorer for Ethereum, based on Apache Kafka :zap:</p>
  <p>Powered by <a href="https://www.typescriptlang.org/">TypeScript</a> / <a href="https://vuejs.org/">VueJS</a> / <a href="http://nestjs.com/">NestJS</a> / <a href="https://kafka.apache.org/">Apache Kafka</a> / <a href="https://github.com/paritytech/parity-ethereum">Parity</a> / <a href="https://www.postgresql.org">Postgres</a> 
  <p><a href="https://travis-ci.org/EthVM/EthVM.svg?branch=develop""><img src="https://travis-ci.org/EthVM/EthVM.svg?branch=develop"/></a></p>
</div>

# EthVM: Open Source Processing Engine and Block Explorer for Ethereum

![Screenshot example](.github/assets/capture-1.png)

<p align="center">
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-1.png" width="100" />
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-2.png" width="100" />
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-3.png" width="100" /> 
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-4.png" width="100" />
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/capture-5.png" width="100" />
</p>

## Warning

**We are on active development!** 

Things may break or not work as expected and documentation may be deprecated! 

If you detect a bug, please report it on the issues section (but make sure that is not a duplicated one!)

You have been warned!

## About

### What is EthVM?

EthVM is an open-source Blockchain Explorer focused mainly on [Ethereum](https://www.ethereum.org/) (although other networks and forks will be supported over time) under the [SSPL license](https://www.mongodb.com/licensing/server-side-public-license) (a small variation of the GNU Affero License v3) and written in a mixture of different languages. 

You can use EthVM as a tool to explore your custom private network or the existing public ones or as a ETL (Extract, Transform, Load) platform to perform different analysis on the data. 

Our core infrastructure is based on well known languages:

- [TypeScript](https://www.typescriptlang.org/)
- [Kotlin](https://kotlinlang.org/)

And also is backed by popular frameworks:

- [Apache Kafka](https://kafka.apache.org/) = [Kafka Connect](https://docs.confluent.io/current/connect/index.html) + [Kafka Streams](https://kafka.apache.org/documentation/streams/) + [Kafka Schema Registry](https://docs.confluent.io/current/schema-registry/docs/index.html) + [Avro](https://avro.apache.org/)
- [VueJs](https://vuejs.org/)
- [NestJS](https://nestjs.com/)

We have choosen the above technologies to allow a wider range of people to contribute to the project regardless of the programming level.

### Why Apache Kafka?

As the [official website](https://kafka.apache.org/) states:

> Kafka is used for building real-time data pipelines and streaming apps. It is horizontally scalable, fault-tolerant, wicked fast, and runs in production in thousands of companies.

<div align="center">
  <img src="https://raw.githubusercontent.com/EthVM/ethvm/develop/.github/assets/ethvm-diagram.jpg" alt="EthVM with Apache Kafka" width="500" />
</div>

We believe that it fits quite nicely within the needs that a Block Explorer typically may have. On the other side, and by fully embracing the Kafka ecosystem, we allow to export the processed information very easily to other platforms.

## Getting Started

For more information on how you can setup your environment and start developing, we recommend you to visit our [Wiki](https://github.com/EthVM/ethvm/wiki/)!

**NOTE**: Please, don't run the code blindly as there are a couple of steps you need to be aware of!

## Contributing

We welcome every kind of contribution, so, please see [CONTRIBUTING](.github/CONTRIBUTING.md) for more details on how to proceed.

## Stay in touch!

We have created our `EthVM - Devs` [Telegram channel](https://t.me/ethvm), feel free to join and hang out!

## License

This project is licensed under the SSPL License (a small variation of the GNU Affero License v3) - see the [LICENSE](LICENSE) file for details ([or read it here online](https://www.mongodb.com/licensing/server-side-public-license)).

<div align="center">
  <img src="https://raw.githubusercontent.com/EthVM/EthVM/develop/.github/assets/powered-by-MEW.png" alt="Powered by MEW" />
</div>
