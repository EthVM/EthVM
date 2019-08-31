package com.ethvm.processing.cache

import org.mapdb.DB
import org.mapdb.Serializer
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

class CacheStore<K, V>(
  memoryDb: DB,
  diskDb: DB,
  scheduledExecutor: ScheduledExecutorService,
  name: String,
  keySerializer: Serializer<K>,
  valueSerializer: Serializer<V>
) {

  private val overflow = diskDb
    .hashMap(name)
    .keySerializer(keySerializer)
    .valueSerializer(valueSerializer)
    .createOrOpen()

  private val map = memoryDb
    .hashMap(name)
    .keySerializer(keySerializer)
    .valueSerializer(valueSerializer)
    .expireAfterCreate(1, TimeUnit.MINUTES)
    .expireAfterGet(1, TimeUnit.MINUTES)
    .expireOverflow(overflow)
    .expireExecutor(scheduledExecutor)
    .createOrOpen()

  private var modifiedKeys = emptyList<K>()

  operator fun set(key: K, value: V?) {
    map[key] = value
    modifiedKeys = modifiedKeys + key
  }

  operator fun get(key: K): V? = map[key]

  fun putAll(value: Map<K, V>) = map.putAll(value)

  fun getOrDefault(key: K, default: V) = map.getOrDefault(key, default)

  fun containsKey(key: K) = map.containsKey(key)

  fun remove(key: K) = map.remove(key)

  fun clear() {
    if (overflow.hasValues) overflow.clear()
    if (map.hasValues) map.clear()
  }

  fun flushToDisk(clearMemory: Boolean = false) {

    if (clearMemory) {
      map.clearWithExpire()
    } else {

      modifiedKeys
        .map { key -> overflow[key] = map[key] }
    }

    modifiedKeys = emptyList()
  }
}
