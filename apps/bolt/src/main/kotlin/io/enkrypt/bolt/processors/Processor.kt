package io.enkrypt.bolt.processors

interface Processor {
  fun onPrepareProcessor()
  fun start()
}
