import { EthValue, Hex } from '@app/core/models'

export class PendingTx {
    public readonly id: string
    private cache: any = {}

    constructor(private readonly pTx: any) {
        this.id = new Hex(this.pTx.hash).toString()
    }

    public getId(): string {
        return this.pTx.hash
    }

    public getHash(): string {
        return this.id
    }

    public getFrom(): Hex {
        if (!this.cache.from) {
            this.cache.from = new Hex(this.pTx.from)
        }
        return this.cache.from
    }

    public getTo(): Hex {
        if (!this.cache.to) {
            this.cache.to = new Hex(this.pTx.to || '')
        }
        return this.cache.to
    }

    public getValue(): EthValue {
        if (!this.cache.ethValue) {
            this.cache.ethValue = new EthValue(this.pTx.value)
        }
        return this.cache.ethValue
    }

    public getGasPrice(): EthValue {
        if (!this.cache.gasPrice) {
            this.cache.gasPrice = new EthValue(this.pTx.gasPrice)
        }
        return this.cache.gasPrice
    }

    public getGasLimit(): number {
        if (!this.cache.gasLimit) {
            this.cache.gasLimit = this.pTx.gasLimit
        }
        return this.cache.gasLimit
    }

    // TODO: Add proper contract address
    public getContractAddress(): string {
        return ''
    }

    public getNonce(): Hex {
        if (!this.cache.nonce) {
            this.cache.nonce = new Hex(this.pTx.nonce)
        }
        return this.cache.nonce
    }

    public getTimestamp(): Date {
        return new Date(this.pTx.timestamp * 1000)
    }
}
