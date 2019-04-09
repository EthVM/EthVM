import { Injectable } from '@nestjs/common'

export interface StartEndInterface {
  from: Date
  to: Date
}

export enum Duration {
  ALL = 'ALL',
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY'
}

@Injectable()
export class DurationService {
  public durationToDates(duration: Duration): StartEndInterface {
    const to = new Date()
    // Always at the end of the day
    to.setHours(23, 59, 59, 999)

    let from: Date
    switch (duration) {
      case Duration.ALL:
        from = new Date(1970, 0, 1) // Far away date, we support different networks
        break
      case Duration.YEAR:
        from = new Date(to.getFullYear(), 0, 1)
        break
      case Duration.MONTH:
        from = new Date(to.getFullYear(), to.getMonth())
        break
      case Duration.WEEK:
        from = new Date()
        from.setDate(to.getDate() - 7)
        break
      case Duration.DAY:
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
}
