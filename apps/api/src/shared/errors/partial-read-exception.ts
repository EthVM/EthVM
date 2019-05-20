/**
 * Indicates that a read failed because one or more expected relations were not found in the database. Typically this
 * will happen on sync, or if the processing layer is not active.
 */
export class PartialReadException extends Error {

  constructor(message?: string) {
    super(message)
  }

}
