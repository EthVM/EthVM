import { Statistic } from 'ethvm-common'

const toStatistic = (statistic: any): Statistic => {

  const s: any = {
    date: statistic.date,
    value: statistic.bigInteger ? statistic.bigInteger.toString() : (statistic.int || statistic.long || statistic.float || statistic.double)
  }
  return s
}

export { toStatistic }
