package io.enkrypt.bolt.processors

interface Processor {
  fun onPrepare()
  fun start()
}
