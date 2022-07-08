export const timeAgo = (date: string | Date) => {
    const prevDate = new Date(date)

    const seconds = Math.floor((new Date().getTime() - prevDate.getTime()) / 1000)

    const intervals = [
        {
            interval: 31536000,
            name: 'year'
        },
        {
            interval: 2592000,
            name: 'month'
        },
        {
            interval: 86400,
            name: 'day'
        },
        {
            interval: 3600,
            name: 'hour'
        },
        {
            interval: 60,
            name: 'minute'
        }
    ]

    for (const interval of intervals) {
        const res = seconds / interval.interval
        if (res > 1) {
            // Check if the remainder is closer to 1. i.e 1.75 year would return 2 years
            const remainder = (seconds % interval.interval) / interval.interval > 0.75
            return `${Math.floor(res)} ${interval.name}${remainder ? 's' : ''} ago`
        }
    }
    return `${Math.floor(seconds)} seconds ago`
}
