export const b64Replacer = (key: any, val: any): any => {
  if (val.type !== 'Buffer' || !Array.isArray(val.data)) {
    return val
  }

  val.data = val.data.length ? 'base64:' + Buffer.from(val.data).toString('base64') : ''
  return val
}

export const b64Reviver = (key: any, val: any) => {
  if (val.type !== 'Buffer') {
    return val
  }

  if (Array.isArray(val.data)) {
    return Buffer.from(val.data)
  }

  if (typeof val.data === 'string') {
    if (!val.data) {
      return Buffer.alloc(0)
    }

    const pos = val.data.indexOf(':')
    if (pos <= 0) {
      // assume maybe utf8?
      return Buffer.from(val.data)
    }

    const type = val.data.slice(0, pos)
    switch (type) {
      case 'base64': // only support base64 for now
      default:
        return Buffer.from(val.data.slice(pos + 1), 'base64')
    }
  }

  throw new Error('Unknown Buffer type')
}
