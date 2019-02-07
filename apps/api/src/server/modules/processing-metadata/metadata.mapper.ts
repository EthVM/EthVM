import { ProcessingMetadata } from 'ethvm-common'

const toProcessingMetadata = (p: any): ProcessingMetadata => {
  const metadata: ProcessingMetadata = {
    id: p._id,
    value: p.boolean !== undefined ? p.boolean : (p.int || p.long || p.float || p.double || p.bigInteger)
  }
  return metadata
}

export { toProcessingMetadata }
