package io.enkrypt.bolt.extensions

import arrow.core.Either
import com.mongodb.TransactionOptions
import com.mongodb.client.ClientSession

inline fun <T> ClientSession.transaction(options: TransactionOptions? = null, action: () -> T): Either<Boolean, Throwable> {
  if (options != null) {
    startTransaction(options)
  } else {
    startTransaction()
  }
  try {
    action()
  } catch (e: Exception) {
    abortTransaction()
    return Either.Right(e)
  }
  commitTransaction()
  return Either.Left(true)
}
