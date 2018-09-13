package io.enkrypt.bolt.extensions

import arrow.core.Either
import com.mongodb.client.ClientSession

inline fun <T> ClientSession.transaction(action: () -> T): Either<Boolean, Exception> {
  startTransaction()
  try {
    action()
  } catch (e: Exception) {
    abortTransaction()
    return Either.Right(e)
  }
  commitTransaction()
  return Either.Left(true)
}
