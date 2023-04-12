export const timeAgo = (date: string | Date, isShort = true) => {
    const prevDate = new Date(date)

    const seconds = Math.floor((new Date().getTime() - prevDate.getTime()) / 1000)

    const intervals = [
        {
            interval: 31536000,
            name: isShort ? 'y' : 'year'
        },
        {
            interval: 2592000,
            name: isShort ? 'm' : 'month'
        },
        {
            interval: 86400,
            name: isShort ? 'd' : 'day'
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
            const isPlural = Math.floor(res) > 1
            return `${Math.floor(res)} ${interval.name}${isPlural ? 's' : ''} ago`
        }
    }
    return seconds > 5 ? `${Math.floor(seconds)} ${isShort ? 'sec' : 'seconds'} ago` : 'Just now'
}
