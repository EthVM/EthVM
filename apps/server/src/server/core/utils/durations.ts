export const toDatePeriods = (duration: string) => {
  const to = new Date()
  // Always at the end of the day
  to.setHours(23, 59, 59, 999)

  let from
  switch (duration) {
    case 'ALL':
      from = new Date(1970, 0, 1) // Far away date, we support different networks
      break
    case 'YEAR':
      from = new Date(to.getFullYear(), 0, 1)
      break
    case 'MONTH':
      from = new Date(to.getFullYear(), to.getMonth())
      break
    case 'DAY':
      from = new Date()
      break
    default:
      throw new Error('Invalid range specified')
  }

  // Always at the start of the day
  from.setHours(0, 0, 0, 0)

  return {
    from,
    to
  }
}
