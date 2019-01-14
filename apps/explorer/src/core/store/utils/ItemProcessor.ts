export type ItemProcessor<T> = (item: T, items: T[]) => T[]
