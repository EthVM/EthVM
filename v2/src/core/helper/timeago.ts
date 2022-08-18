export const timeAgo = (date: string | Date, isShort: boolean) => {
    const prevDate = new Date(date)

    const seconds = Math.floor((new Date().getTime() - prevDate.getTime()) / 1000)

    const intervals = [
        {
            interval: 31536000,
            name: isShort ? 'yr' : 'year'
        },
        {
            interval: 2592000,
            name: isShort ? 'mth' : 'month'
        },
        {
            interval: 86400,
            name: isShort ? 'day' : 'day'
        },
        {
            interval: 3600,
            name: isShort ? 'hr' : 'hour'
        },
        {
            interval: 60,
            name: isShort ? 'min' : 'minute'
        }
    ]

    for (const interval of intervals) {
        const res = seconds / interval.interval
        if (res > 1) {
            // Check if the remainder is closer to 1. i.e 1.75 year would return 2 years
            const remainder = (seconds % interval.interval) / interval.interval > 0.75
            const isPlural = Math.floor(res) > 1
            return `${Math.floor(res)} ${interval.name}${isPlural ? 's' : ''} ago`
        }
    }
    return seconds > 5 ? `${Math.floor(seconds)} ${isShort ? 'secs' : 'seconds'} ago` : 'Just now'
}
