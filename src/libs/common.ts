import bn from 'bignumber.js'
import ethUnits from 'ethereumjs-units'

class Hash{
	hash: string;
	constructor(_hash: string){
		this.hash = _hash
	}
	toString(): string {
		return this.hash
	}
	toBuffer(): Buffer {
		return new Buffer(this.hash, 'hex')
	}
}

class EthValue {
	value: string;
	constructor(_value) {
		this.value = _value
	}
	toEth(): number {
		return ethUnits.convert(new bn(this.value).toFixed(), 'wei', 'eth')
	}
	toWei(): number {
		return ethUnits.convert(new bn(this.value).toFixed(), 'wei', 'wei')
	}
	toGWei(): number {
		return ethUnits.convert(new bn(this.value).toFixed(), 'wei', 'gwei')
	}
}
class HexNumber {
	value: string;
	constructor(_value: string) {
		this.value = _value
	}
	toNumber(): string {
		return new bn(this.value).toFixed()
	}
}
let common = {
	Hash: (_hash: string): Hash => {
		return new Hash(_hash)
	},
	EthValue: (_value: string): EthValue =>{
		return new EthValue(_value)
	},
	HexNumber: (_value: string): HexNumber =>{
		return new HexNumber(_value)
	}

}

export default common