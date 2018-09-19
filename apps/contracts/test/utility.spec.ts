import  Web3 from 'web3'
import { expect } from 'chai'
import * as rpc from '@enkrypt.io/json-rpc2'
import * as Util from 'util'

const client = rpc.Client.$create(8545, 'localhost')
client.callAsync = Util.promisify(client.call)
export interface TxParams {
  from?: string
  to?: string
  nonce?: string
  gas?: string
  data?: any
  gasPrice?: string
  value?: string
}
const utilityABI = [ { "constant": true, "inputs": [{ "name": "Owner", "type": "address" }], "name": "getAllBalance", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }]
const utilityAddress = '0x0000000000000000000000000000000000000065'
var web3 = new Web3('http://localhost:8545');
const utilityInstance = new web3.eth.Contract(utilityABI,utilityAddress)
describe('getAllBalance', () => {
  it('It should return array of tokens one with balance',async()=>{
    const encodedData = await utilityInstance.methods.getAllBalance('0x9319b0835c2DB1a31E067b5667B1e9b0AD278215').encodeABI()
    expect(encodedData).to.be.a('string');
    const hexResponse = await ethCall({to:utilityAddress, data:encodedData})
    const jsonString = web3.utils.hexToString(hexResponse)
    const tokens = JSON.parse(jsonString)
    tokens.forEach(token => {
      if (token.address == "0x0000000000000000000000000000000000000064"){
        expect(token.balance).to.be.eq(100);
      }
    });
    expect(tokens).to.be.length(3);
    })
    it('It should return array of tokens without balance',async()=>{
      const encodedData = await utilityInstance.methods.getAllBalance('0x0000000000000000000000000000000000000070').encodeABI()
      const hexResponse = await ethCall({to:utilityAddress, data:encodedData})
      const jsonString = web3.utils.hexToString(hexResponse)
      const tokens = JSON.parse(jsonString)
      tokens.forEach(token => {
        if (token.address == "0x0000000000000000000000000000000000000064"){
          expect(token.balance).to.be.eq(0);
        }
      });
      })
})
async function ethCall(params: TxParams, privateKey?: string): Promise<string> {
  try {
    const hash = await client.callAsync('eth_call', [params,"latest"])
    return hash
  } catch (e) {
    throw e
  }
}
