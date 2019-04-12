package com.ethvm.kafka.connect.sources.web3.ext

import java.util.NoSuchElementException
import java.util.Optional
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executor
import java.util.concurrent.ExecutorService
import java.util.concurrent.ForkJoinPool
import java.util.function.BiConsumer
import java.util.function.BiFunction
import java.util.function.Function
import java.util.function.Supplier

// Creation
inline fun <A> Future(executor: Executor = ForkJoinExecutor, crossinline block: () -> A): CompletableFuture<A> =
  CompletableFuture.supplyAsync(Supplier { block() }, executor)

inline fun <A> ImmediateFuture(crossinline block: () -> A): CompletableFuture<A> = Future(DirectExecutor, block)

fun <A> A.toCompletableFuture(): CompletableFuture<A> = CompletableFuture.completedFuture(this)

fun <A> Throwable.toCompletableFuture(): CompletableFuture<A> = CompletableFuture<A>().apply { completeExceptionally(this@toCompletableFuture) }

// Monadic Operations
inline fun <A, B> CompletableFuture<A>.map(executor: Executor = ForkJoinExecutor, crossinline f: (A) -> B): CompletableFuture<B> =
  thenApplyAsync(Function { f(it) }, executor)

inline fun <A, B> CompletableFuture<A>.flatMap(executor: Executor = ForkJoinExecutor, crossinline f: (A) -> CompletableFuture<B>): CompletableFuture<B> =
  thenComposeAsync(Function { f(it) }, executor)

fun <A> CompletableFuture<CompletableFuture<A>>.flatten(): CompletableFuture<A> = flatMap { it }

inline fun <A> CompletableFuture<A>.filter(executor: Executor = ForkJoinExecutor, crossinline predicate: (A) -> Boolean): CompletableFuture<A> =
  map(executor) {
    if (predicate(it)) it else throw NoSuchElementException("CompletableFuture.filter predicate is not satisfied")
  }

fun <A, B> CompletableFuture<A>.zip(other: CompletableFuture<B>, executor: Executor = ForkJoinPool.commonPool()): CompletableFuture<Pair<A, B>> =
  zip(other, executor) { a, b -> a to b }

inline fun <A, B, C> CompletableFuture<A>.zip(
  other: CompletableFuture<B>,
  executor: Executor = ForkJoinExecutor,
  crossinline f: (A, B) -> C
): CompletableFuture<C> =
  thenCombineAsync(other, BiFunction { a, b -> f(a, b) }, executor)

// Error handling / Recovery
inline fun <A> CompletableFuture<A>.recover(crossinline f: (Throwable) -> A): CompletableFuture<A> = exceptionally { f(it.cause ?: it) }

inline fun <A> CompletableFuture<A>.recoverWith(
  executor: Executor = ForkJoinExecutor,
  crossinline f: (Throwable) -> CompletableFuture<A>
): CompletableFuture<A> {
  val future = CompletableFuture<A>()
  onComplete(executor,
    { f(it).onComplete(executor, { future.completeExceptionally(it) }, { future.complete(it) }) },
    { future.complete(it) }
  )
  return future
}

inline fun <A, reified E : Throwable> CompletableFuture<A>.mapError(crossinline f: (E) -> Throwable): CompletableFuture<A> = exceptionally {
  val throwable = it.cause ?: it
  if (throwable is E) {
    throw f(throwable)
  } else {
    throw throwable
  }
}

inline fun <A> CompletableFuture<A>.fallbackTo(executor: Executor = ForkJoinExecutor, crossinline f: () -> CompletableFuture<A>): CompletableFuture<A> =
  recoverWith(executor) { f() }

// Callbacks
inline fun <A> CompletableFuture<A>.onFailure(executor: Executor = ForkJoinExecutor, crossinline f: (Throwable) -> Unit): CompletableFuture<A> =
  whenCompleteAsync(BiConsumer { _, throwable: Throwable? ->
    throwable?.let { f(it.cause ?: it) }
  }, executor)

inline fun <A> CompletableFuture<A>.onSuccess(executor: Executor = ForkJoinExecutor, crossinline f: (A) -> Unit): CompletableFuture<A> =
  whenCompleteAsync(BiConsumer { a: A, _ ->
    f(a)
  }, executor)

inline fun <A> CompletableFuture<A>.onComplete(
  executor: Executor = ForkJoinExecutor,
  crossinline onFailure: (Throwable) -> Unit,
  crossinline onSuccess: (A) -> Unit
): CompletableFuture<A> =
  whenCompleteAsync(BiConsumer { a: A, throwable: Throwable? ->
    if (throwable != null) {
      onFailure(throwable.cause ?: throwable)
    } else {
      onSuccess(a)
    }
  }, executor)

object Future {

  fun <A> firstCompletedOf(futures: Iterable<CompletableFuture<A>>, executor: Executor = ForkJoinPool.commonPool()): CompletableFuture<A> {
    val future = CompletableFuture<A>()
    val onCompleteFirst: (CompletableFuture<A>) -> Unit = { it.onComplete(executor, { future.completeExceptionally(it) }, { future.complete(it) }) }
    futures.forEach(onCompleteFirst)
    return future
  }

  fun <A> allAsList(futures: Iterable<CompletableFuture<A>>, executor: Executor = ForkJoinPool.commonPool()): CompletableFuture<List<A>> =
    futures.fold(mutableListOf<A>().toCompletableFuture()) { fr, fa ->
      fr.zip(fa, executor) { r, a -> r.add(a); r }
    }.map(executor) { it.toList() }

  fun <A> successfulList(futures: Iterable<CompletableFuture<A>>, executor: Executor = ForkJoinPool.commonPool()): CompletableFuture<List<A>> =
    futures.fold(mutableListOf<A>().toCompletableFuture()) { fr, fa ->
      fr.flatMap(executor) { r ->
        fa
          .map(executor) { Optional.of(it) }
          .recover { Optional.empty() }
          .map(executor) {
            if (it.isPresent) {
              r.add(it.get())
            }
            r
          }
      }
    }.map(executor) { it.toList() }

  fun <A, R> fold(futures: Iterable<CompletableFuture<A>>, initial: R, executor: Executor = ForkJoinExecutor, op: (R, A) -> R): CompletableFuture<R> =
    fold(futures.iterator(), initial, executor, op)

  fun <A, R> fold(iterator: Iterator<CompletableFuture<A>>, initial: R, executor: Executor = ForkJoinExecutor, op: (R, A) -> R): CompletableFuture<R> =
    if (!iterator.hasNext()) initial.toCompletableFuture()
    else iterator.next().flatMap(executor) { fold(iterator, op(initial, it), executor, op) }

  fun <A> reduce(iterable: Iterable<CompletableFuture<A>>, executor: Executor = ForkJoinExecutor, op: (A, A) -> A): CompletableFuture<A> {
    val iterator = iterable.iterator()
    return if (!iterator.hasNext()) throw UnsupportedOperationException("Empty collection can't be reduced.")
    else iterator.next().flatMap { fold(iterator, it, executor, op) }
  }

  fun <A, B> transform(iterable: Iterable<CompletableFuture<A>>, executor: Executor = ForkJoinExecutor, f: (A) -> B): CompletableFuture<List<B>> =
    iterable.fold(mutableListOf<B>().toCompletableFuture()) { fr, fa ->
      fr.zip(fa, executor) { r, a -> r.add(f(a)); r }
    }.map(executor) { it.toList() }
}

object DirectExecutor : Executor {
  override fun execute(command: Runnable) {
    command.run()
  }
}

object ForkJoinExecutor : ExecutorService by ForkJoinPool.commonPool()