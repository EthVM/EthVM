import * as rlp from 'rlp'
import { utils } from 'web3'
import { toBuffer, ecrecover, pubToAddress } from 'ethereumjs-util'
const getAuthor = block => {
  if (block.number === 0) return '0x0000000000000000000000000000000000000000'
  const headerFields = [
    block.parentHash,
    block.sha3Uncles,
    block.miner,
    block.stateRoot,
    block.transactionsRoot,
    block.receiptsRoot,
    block.logsBloom,
    utils.toHex(block.difficulty),
    utils.toHex(block.number),
    utils.toHex(block.gasLimit),
    utils.toHex(block.gasUsed),
    utils.toHex(block.timestamp),
    block.extraData.substring(0, block.extraData.length - 65 * 2),
    block.mixHash,
    block.nonce
  ]
  const encoded = rlp.encode(headerFields)
  const sigHex = block.extraData.substring(block.extraData.length - 65 * 2)
  const sig = Buffer.from(sigHex, 'hex')
  sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64]
  const pubKey = ecrecover(toBuffer(utils.keccak256(encoded)), sig[64], sig.slice(0, 32), sig.slice(32, 64))
  return '0x' + pubToAddress(pubKey).toString('hex')
}
export default getAuthor
