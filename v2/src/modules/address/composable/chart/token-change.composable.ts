import { useGetTimeseriesDataQuery, useTimeseriesEthAvgSubscription } from '@module/address/composable/chart/balanceQuery.generated'
import { TimeseriesScale } from '@/apollo/types'
import { computed, isRef, Ref, watch } from 'vue'
import { fromWei } from 'web3-utils'

const generateUnixTime = (index: number) => {
    const date = new Date()
    let scale: TimeseriesScale
    switch (index) {
        case 0:
            date.setHours(date.getHours() - 1)
            scale = TimeseriesScale.Seconds
            break
        case 1:
            date.setDate(date.getDate() - 1)
            scale = TimeseriesScale.Minutes
            break
        case 2:
            date.setDate(date.getDate() - 7)
            scale = TimeseriesScale.Minutes
            break
        case 3:
            date.setMonth(date.getMonth() - 1)
            scale = TimeseriesScale.Days
            break
        case 4:
            date.setFullYear(date.getFullYear() - 1)
            scale = TimeseriesScale.Days
            break
        default:
            date.setFullYear(date.getFullYear() - 1)
            scale = TimeseriesScale.Days
            break
    }
    return {
        scale,
        fromT: Math.floor(date.getTime() / 1000)
    }
}

export function useTokenBalanceChange(aggregate: Ref, tokenContract: Ref, address: string, timeIndex: Ref) {
    const keyVal = computed(() => `${aggregate.value}-${tokenContract.value}-${address.toLowerCase()}`)
    // const keyVal = computed(() => `${aggregate.value}-0xETH-${address.toLowerCase()}`)

    // create unix timestamp
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1)
    const unixYear = Math.floor(date.getTime() / 1000)
    const { fromT: unixTime, scale } = generateUnixTime(timeIndex.value)
    const { result, loading, refetch } = useGetTimeseriesDataQuery({
        key: keyVal.value,
        scale,
        fromT: unixTime
    })

    const { result: timeSeriesData, onResult: onNewTimeSeriesData } = useTimeseriesEthAvgSubscription(() => ({
        key: keyVal.value,
        scale: TimeseriesScale.Minutes
    }))

    if (isRef(tokenContract)) {
        watch([tokenContract, aggregate, timeIndex], () => {
            const { fromT: unixTime, scale } = generateUnixTime(timeIndex.value)
            refetch({
                key: keyVal.value,
                scale,
                fromT: unixTime
            })
        })
    }

    const toEth = (value: string | undefined) => {
        if (value) {
            return fromWei(value, 'ether')
        }
    }

    const chartPoints = computed(() => {
        if (result && result.value?.getTimeseriesData.items?.length) {
            return result.value.getTimeseriesData.items.map(el => ({
                x: el ? new Date(el.timestamp * 1e3).toLocaleDateString() : new Date().toLocaleDateString(),
                y: toEth(el?.value)
            }))
        }
        return {
            x: new Date(unixTime * 1e3).toLocaleDateString(),
            y: 200
        }
    })

    return { result, loading, chartPoints, refetchPoints: refetch, onNewTimeSeriesData }
}
