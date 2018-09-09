#!/bin/bash -e

gogen-avro --package=models apps/avro-schemas/go apps/avro-schemas/block.schema.v1.asvc apps/avro-schemas/pendingtx.schema.v1.asvc

avro-tools compile schema apps/avro-schemas/block.schema.v1.asvc apps/avro-schemas/java
avro-tools compile schema apps/avro-schemas/pendingtx.schema.v1.asvc apps/avro-schemas/java
