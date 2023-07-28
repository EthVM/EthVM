import { i18nGlobal } from '@/translations/index'
export const timeAgo = (date: string | Date, isShort = true) => {
    const formatDate = new Date(date)

    const seconds = Math.floor((new Date().getTime() - formatDate.getTime()) / 1000)

    const intervals = [
        {
            interval: 31536000,
            name: isShort ? 'yearShort' : 'year'
        },
        {
            interval: 2592000,
            name: isShort ? 'monthShort' : 'month'
        },
        {
            interval: 86400,
            name: isShort ? 'dayShort' : 'day'
        },
        {
            interval: 3600,
            name: isShort ? 'hourShort' : 'hour'
        },
        {
            interval: 60,
            name: isShort ? 'minuteShort' : 'minute'
        }
    ]
    for (const interval of intervals) {
        const res = seconds / interval.interval
        if (res > 1) {
            const dateString = `timeAgo.${interval.name}`
            const _n = Math.floor(res)
            if (isShort) {
                return i18nGlobal.t(dateString, { n: _n })
            }
            return i18nGlobal.t(dateString, { n: _n })
        }
    }
    const dateString = isShort ? `timeAgo.secondsShort` : `timeAgo.seconds`
    return seconds < 30 ? i18nGlobal.t('timeAgo.justNow') : i18nGlobal.t(dateString, { n: Math.floor(seconds) })
}
