/**
 * Applies Object.assign but not for any fields which are null or undefined. This helps
 * with postgres. Any attempts to nullify a field in the database should be explicity via some
 * kind of mutation function etc.
 *
 * @param target
 * @param source
 */
export function assignClean(target: any, source: any) {

  const sourceCopy = {...source};

  for(const key of Object.keys(sourceCopy)) {
      const value = sourceCopy[key];
      if(value === null || value === undefined) {
          delete sourceCopy[key];
      }
  }

  return Object.assign(target, sourceCopy);
}
