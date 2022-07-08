export class Hex {
    private hexString: string

    constructor(raw: Buffer | string) {
        if (raw instanceof Buffer) {
            this.hexString = '0x' + Buffer.from(raw).toString('hex')
            return
        }

        if (typeof raw === 'string') {
            this.hexString = raw.startsWith('0x') ? raw : '0x' + raw
            return
        }

        this.hexString = '0x0'
    }

    public toString(): string {
        return this.hexString
    }

    public toBuffer(): Buffer {
        return Buffer.from(this.hexString.substring(2), 'hex')
    }

    public isEmpty(): boolean {
        return this.hexString === '0x0' || this.hexString === '0x'
    }
}
