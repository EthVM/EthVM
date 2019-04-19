package com.ethvm.kafka.connect.sources.jdbc

import com.google.common.base.CaseFormat

fun String.camelToSnakeCase(): String =
  CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, this)

fun String.snakeToCamelCase(): String =
  CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, this)
