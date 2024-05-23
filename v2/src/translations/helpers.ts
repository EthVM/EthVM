import en_US from './en_US.json'

export type Mess = 'en_US' | 'ru_RU' | 'vi_VN'

export type MassagesShema = {
    [i in Mess]: typeof en_US
}

export const isOfTypeMes = (keyInput: string): keyInput is Mess => {
    return ['en_US', 'ru_RU', 'vi_VN'].includes(keyInput)
}
