import { NftMetaFragment } from '../../apollo/NFTMeta/nftMeta.generated'
export interface NFTDetails {
    contract: string
    type: string
    id: string
    meta?: NftMetaFragment
}
