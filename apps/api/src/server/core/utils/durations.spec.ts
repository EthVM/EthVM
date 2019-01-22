import { expect } from 'chai'
import { toDatePeriods } from './durations'

describe('durations', () => {
  it('should give a correct date periods for ALL', () => {
    const periods = toDatePeriods('ALL')
    expect(periods).to.be.an('object')

    expect(periods.from).to.be.instanceof(Date)
    expect(periods.from.getFullYear()).to.equal(1970)
    expect(periods.from.getMonth()).to.equal(0)
    expect(periods.from.getDate()).to.equal(1)
    expect(periods.from.getHours()).to.equal(0)
    expect(periods.from.getMinutes()).to.equal(0)

    const now = new Date()
    expect(periods.to).to.be.instanceof(Date)
    expect(periods.to.getFullYear()).to.equal(now.getFullYear())
    expect(periods.to.getMonth()).to.equal(now.getMonth())
    expect(periods.to.getDate()).to.equal(now.getDate())
    expect(periods.to.getHours()).to.equal(23)
    expect(periods.to.getMinutes()).to.equal(59)
  })

  it('should give a correct date periods for YEAR', () => {
    const now = new Date()

    const periods = toDatePeriods('YEAR')
    expect(periods).to.be.an('object')

    expect(periods.from).to.be.instanceof(Date)
    expect(periods.from.getFullYear()).to.equal(now.getFullYear())
    expect(periods.from.getMonth()).to.equal(0)
    expect(periods.from.getDate()).to.equal(1)
    expect(periods.from.getHours()).to.equal(0)
    expect(periods.from.getMinutes()).to.equal(0)

    expect(periods.to).to.be.instanceof(Date)
    expect(periods.to.getFullYear()).to.equal(now.getFullYear())
    expect(periods.to.getMonth()).to.equal(now.getMonth())
    expect(periods.to.getDate()).to.equal(now.getDate())
    expect(periods.to.getHours()).to.equal(23)
    expect(periods.to.getMinutes()).to.equal(59)
  })

  it('should give a correct date periods for MONTH', () => {
    const now = new Date()

    const periods = toDatePeriods('MONTH')
    expect(periods).to.be.an('object')

    expect(periods.from).to.be.instanceof(Date)
    expect(periods.from.getFullYear()).to.equal(now.getFullYear())
    expect(periods.from.getMonth()).to.equal(now.getMonth())
    expect(periods.from.getDate()).to.equal(1)
    expect(periods.from.getHours()).to.equal(0)
    expect(periods.from.getMinutes()).to.equal(0)

    expect(periods.to).to.be.instanceof(Date)
    expect(periods.to.getFullYear()).to.equal(now.getFullYear())
    expect(periods.to.getMonth()).to.equal(now.getMonth())
    expect(periods.to.getDate()).to.equal(now.getDate())
    expect(periods.to.getHours()).to.equal(23)
    expect(periods.to.getMinutes()).to.equal(59)
  })

  it('should give a correct date periods for WEEK', () => {
    const now = new Date()

    const periods = toDatePeriods('WEEK')
    expect(periods).to.be.an('object')

    expect(periods.from).to.be.instanceof(Date)
    expect(periods.from.getFullYear()).to.equal(now.getFullYear())
    expect(periods.from.getMonth()).to.equal(now.getMonth())
    expect(periods.from.getDate()).to.equal(now.getDate() - 7)
    expect(periods.from.getHours()).to.equal(0)
    expect(periods.from.getMinutes()).to.equal(0)

    expect(periods.to).to.be.instanceof(Date)
    expect(periods.to.getFullYear()).to.equal(now.getFullYear())
    expect(periods.to.getMonth()).to.equal(now.getMonth())
    expect(periods.to.getDate()).to.equal(now.getDate())
    expect(periods.to.getHours()).to.equal(23)
    expect(periods.to.getMinutes()).to.equal(59)
  })

  it('should give a correct date periods for DAY', () => {
    const now = new Date()

    const periods = toDatePeriods('DAY')
    expect(periods).to.be.an('object')

    expect(periods.from).to.be.instanceof(Date)
    expect(periods.from.getFullYear()).to.equal(now.getFullYear())
    expect(periods.from.getMonth()).to.equal(now.getMonth())
    expect(periods.from.getDate()).to.equal(now.getDate())
    expect(periods.from.getHours()).to.equal(0)
    expect(periods.from.getMinutes()).to.equal(0)

    expect(periods.to).to.be.instanceof(Date)
    expect(periods.to.getFullYear()).to.equal(now.getFullYear())
    expect(periods.to.getMonth()).to.equal(now.getMonth())
    expect(periods.to.getDate()).to.equal(now.getDate())
    expect(periods.to.getHours()).to.equal(23)
    expect(periods.to.getMinutes()).to.equal(59)
  })

  it('should throw exception for invalid period', () => {
    const input = () => {
      toDatePeriods('invalid')
    }
    expect(input).to.throw()
  })
})
