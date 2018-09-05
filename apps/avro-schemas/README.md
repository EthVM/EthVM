# EthVM: Avro-Schemas

## Introduction

This subproject contains Avro schemas that our client `go-ethereum` and projects like `bolt` uses.

## Generation

### Java

To generate Java schemas, install `avro-tool` utility. After that, you can run the following in your terminal:

```sh
$ avro-tools compile schema block.schema.v1.kafka.asvc java
```

### Go

Make sure you have installed `gogen-avro` generator. After that, you can run the following in your terminal:

```sh
sh gogen-avro --package=ethvm go block.schema.v1.kafka.asvc
```
