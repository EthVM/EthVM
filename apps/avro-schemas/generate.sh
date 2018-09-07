#!/bin/bash

gogen-avro --package=models go block.schema.v1.asvc pendingtx.schema.v1.asvc

avro-tools compile schema block.schema.v1.asvc java
avro-tools compile schema pendingtx.schema.v1.asvc java
