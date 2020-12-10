import { EnumAdrChips } from '@app/core/components/props'

export enum FavDialogModes {
    add = 'add',
    edit = 'edit',
    remove = 'remove',
    searchAdd = 'search-and-add'
}

export class DialogAddress {
    address!: string
    name?: string
    chips?: EnumAdrChips[]

    constructor(_addr: string, _name?: string, _chips?: EnumAdrChips[]) {
        this.address = _addr
        this.name = _name
        this.chips = _chips
    }
    getAddress(): string {
        return this.address
    }
    getName(): string | undefined {
        return this.name
    }
    getChips(): EnumAdrChips[] | undefined {
        return this.chips
    }
    setName(_name: string): void {
        this.name = _name
    }
    setChips(_chips: EnumAdrChips[]): void {
        this.chips = _chips
    }
}
