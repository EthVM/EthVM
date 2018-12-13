declare module 'ethereumjs-abi' {
  import BN from 'bn.js'

  export type PrimitiveEncodable = string | number | boolean | BN
  export type Encodable = PrimitiveEncodable | PrimitiveEncodable[]

  export type PrimitiveDecodable = string | boolean | BN
  export type Decodable = PrimitiveDecodable | PrimitiveDecodable[]

  // TODO(ritave): Make a type of all possible type strings
  export function rawEncode(types: string[], args: Encodable[]): Buffer
  export function rawDecode(types: string[], data: Buffer): Decodable[]

  export function simpleEncode(signature: string, ...args: Encodable[]): Buffer
  export function simpleDecode(signature: string, data: Buffer): Decodable[]

  export function soliditySHA3(types: string[], args: Encodable[]): Buffer
  export function soliditySHA256(types: string[], args: Encodable[]): Buffer
  export function solidityRIPEMD160(types: string[], args: Encodable[]): Buffer

  export function eventID(name: string, types: string[]): Buffer
  export function methodID(name: string, types: string[]): Buffer
  export function stringify(types: string[], args: Encodable[]): string[]

  export function fromSerpent(type: string): string[]
  export function toSerpent(types: string[]): string
}
