import { blockLayout } from '@/typeLayouts'
import ethUnits  from 'ethereumjs-units'
import bn from 'bignumber.js'
import _ from 'lodash'
class BlockProcessor {
	private readonly block: blockLayout
	constructor(block: blockLayout) {
		this.block = block
		let parent = this
		Object.keys(parent.block).forEach((key, idx) => {
			parent[_.camelCase('get ' + key)] = () => {
				return parent.block[key]
			}
			parent[_.camelCase('get ' + key)].toBuffer = (): Buffer => {
				return Buffer.from(parent.block[key].toLowerCase().replace('0x', ''), 'hex')
			}
			parent[_.camelCase('get ' + key)].toEth = (): number => {
				return ethUnits.convert(new bn(parent.block[key]).toString(), 'wei', 'eth')
			}
		})
	}
}
export default BlockProcessor