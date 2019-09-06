package com.ethvm.processing.cache

import org.mapdb.DB
import org.mapdb.Serializer
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

/**
 * Utility for managing the interoperation of in memory and disk based db instances
 */
class CacheStore<K, V>(
  memoryDb: DB,
  diskDb: DB,
  scheduledExecutor: ScheduledExecutorService,
  name: String,
  keySerializer: Serializer<K>,
  valueSerializer: Serializer<V>,
  defaultValue: V,
  maxMemorySize: Int = 16384
) {

  // persistent on disk
  private val overflowMap = diskDb
    .hashMap(name)
    .keySerializer(keySerializer)
    .valueSerializer(valueSerializer)
    .createOrOpen()

  // in memory map connected to the overflow
  private val memoryMap = memoryDb
    .hashMap(name)
    .keySerializer(keySerializer)
    .valueSerializer(valueSerializer)
    .expireMaxSize(maxMemorySize.toLong())
    .expireAfterGet()
    .expireOverflow(overflowMap)
    .expireExecutor(scheduledExecutor)
    .createOrOpen()

  // a list of keys modified during a tx
  private var modifiedKeys = emptyList<K>()

  operator fun set(key: K, value: V?) {
    memoryMap[key] = value
    modifiedKeys = modifiedKeys + key
  }

  operator fun get(key: K): V? = memoryMap[key]

  fun putAll(value: Map<K, V>) = memoryMap.putAll(value)

  fun getOrDefault(key: K, default: V) = memoryMap.getOrDefault(key, default)

  fun containsKey(key: K) = memoryMap.containsKey(key)

  fun remove(key: K) = memoryMap.remove(key)

  fun clear() {
    if (overflowMap.hasValues) overflowMap.clear()
    if (memoryMap.hasValues) memoryMap.clear()
  }

  fun flushToDisk(clearMemory: Boolean = false) {

    if (clearMemory) {

      // empty out the in memory map and flush it's contents to the disk db
      memoryMap.clearWithExpire()

    } else {

      // ensure the disk db has the changes which have occurred without having
      // to clear the in memory state

      modifiedKeys
        .map { key -> overflowMap[key] = memoryMap[key] }

    }

    // reset key tracking
    modifiedKeys = emptyList()

  }
}
