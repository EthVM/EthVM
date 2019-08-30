/**
 * Indicates that the block number argument passed is not valid
 */
export class InvalidBlockNumberException extends Error {

  constructor(message?: string) {
    super(message)
  }

}
