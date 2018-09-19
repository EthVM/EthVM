import  Web3 from 'web3'
import { expect } from 'chai'
import * as rpc from '@enkrypt.io/json-rpc2'
import * as Util from 'util'
import * as abi from 'ethereumjs-abi'


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
const utilityABI =[ { "constant": true, "inputs": [ { "name": "Owner", "type": "address" }, { "name": "Limit", "type": "uint256" }, { "name": "Page", "type": "uint256" } ], "name": "getAllBalance", "outputs": [ { "name": "", "type": "bytes" } ], "payable": false, "stateMutability": "pure", "type": "function" } ]
const utilityAddress = '0x0000000000000000000000000000000000000065'
var web3 = new Web3('http://localhost:8545');
const utilityInstance = new web3.eth.Contract(utilityABI,utilityAddress)
describe('getAllBalance', () => {
  it('It should return array of tokens one with balance',async()=>{
    const argss = ['address', 'uint32', 'uint32']
    const vals = ['0x9319b0835c2DB1a31E067b5667B1e9b0AD278215', 3, 0]
    const encodedData =  encodeCall('getAllBalance', argss, vals)
    // const encodedData = await utilityInstance.methods.getAllBalance([,'0','1']).encodeABI()
    // expect(encodedData).to.be.a('int');
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
      const argss = ['address', 'uint32', 'uint32']
      let vals = ['0x9319b0835c2DB1a31E067b5667B1e9b0AD278215', 100, 100]
      let encodedData =  encodeCall('getAllBalance', argss, vals)
      let hexResponse = await ethCall({to:utilityAddress, data:encodedData})
      let jsonString = web3.utils.hexToString(hexResponse)
      expect(jsonString).to.be.eq("null");

      vals = ['0x9319b0835c2DB1a31E067b5667B1e9b0AD278215', 1, 0]
      encodedData =  encodeCall('getAllBalance', argss, vals)
      hexResponse = await ethCall({to:utilityAddress, data:encodedData})
      jsonString = web3.utils.hexToString(hexResponse)
      const tokens = JSON.parse(jsonString)
      tokens.forEach(token => {
        if (token.address == "0x0000000000000000000000000000000000000064"){
          expect(token.balance).to.be.eq(0);
        }
      });
      })
})

function encodeCall(name: string, args: string[] = [], rawValues: any[] = []): string {
  const values = rawValues.map(value => value.toString())
  const methodId = abi.methodID(name, args).toString('hex')
  const params = abi.rawEncode(args, values).toString('hex')
  return '0x' + methodId + params
}
async function ethCall(params: TxParams, privateKey?: string): Promise<string> {
  try {
    const hash = await client.callAsync('eth_call', [params,"latest"])
    return hash
  } catch (e) {
    throw e
  }
}
