/**
 * Indicates that we are currently syncing and that data in the database is partial
 */
export class SyncingException extends Error {

  constructor(message?: string) {
    super(message)
  }

}
