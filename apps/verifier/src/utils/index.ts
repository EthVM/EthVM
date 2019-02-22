import BigInteger from 'node-biginteger'

const UBigInt = (buffer: Buffer): BigInteger => BigInteger.fromBuffer(1, buffer)
const UBigIntAsNumber = (buffer: Buffer): number => BigInteger.fromBuffer(1, buffer).longValue().toNumber()

export { UBigInt, UBigIntAsNumber }
