/**
 * Applies Object.assign but not for any fields which are null or undefined. This helps
 * with postgres. Any attempts to nullify a field in the database should be explicity via some
 * kind of mutation function etc.
 *
 * @param target
 * @param source
 */

export function assignClean(target: any, source: any) {
  const sourceCopy = { ...source }

  for (const key of Object.keys(sourceCopy)) {
    const value = sourceCopy[key]
    if (value === null || value === undefined) {
      delete sourceCopy[key]
    }
  }

  return Object.assign(target, sourceCopy)
}

export function setEquals(as, bs) {
  if (as.size !== bs.size) return false
  for (const a of as) if (!bs.has(a)) return false
  return true
}

/**
 * Determines if a Buffer is a GZIP file
 * modified from https://github.com/kevva/is-gzip
 * @param buffer
 */
export function isGzip(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 3) {
    return false;
  }

  return buffer[0] === 0x1F && buffer[1] === 0x8B && buffer[2] === 0x08;
}

/**
 * Handles errors when extracting a field from an incorrectly formatted JSON object
 * @param field - name of field to extract
 * @param json - JSON object to extract field from (can be null or undefined)
 */
export function extractFromJson(field: string, json?: string | null): string | undefined {

  if (!json) {
    return undefined
  }

  let extracted

  try {
    extracted = JSON.parse(json)[field]
  } catch (e) {
    return 'Invalid JSON'
  }

  return extracted

}
