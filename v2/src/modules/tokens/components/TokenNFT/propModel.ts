import { NftMetaFragment } from '@core/composables/NftMeta/nftMeta.generated'
export interface NFTDetails {
    contract: string
    type: string
    id: string
    meta?: NftMetaFragment
}
