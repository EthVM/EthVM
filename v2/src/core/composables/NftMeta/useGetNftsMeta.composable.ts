import { computed, Ref } from 'vue'
import { useGetNftTokensMetaQuery, NftMetaFragment } from './nftMeta.generated'
import { NftId, generateId, generateMapId } from './helpers'
import { useNetwork } from '../Network/useNetwork'
export function useGetNftsMeta(tokenIds: Ref<NftId[]>, loadingIds: Ref<boolean>) {
    const { supportsNft, nftId } = useNetwork()
    /**
     * Functions generates id to be used in the fetch useGetNftTokensMetaQuery
     */
    const generateFetchId = (tokens: NftId[]): string => {
        let ids = ''
        tokens.forEach(i => {
            const id = generateId(i.id)
            ids = `${ids}${nftId.value}.${i.contract}.${id},`
        })
        return ids
    }
    /**
     * Computed Property of the original ids to fetch
     * Triggers apollo call based on the ids.
     */
    const ids = computed<string>(() => {
        if (tokenIds.value.length > 0) {
            return generateFetchId(tokenIds.value)
        }
        return ''
    })

    const { result: metaResult, loading: loadingMeta } = useGetNftTokensMetaQuery(
        () => ({
            input: ids.value
        }),
        () => ({
            clientId: 'nftClient',
            enabled: ids.value !== '' && supportsNft.value
        })
    )

    /**
     * Computed Property of the NFT Meta
     * Returns Map of the nfts
     * To get a specific nft from it use map.get(generateMapId(contract, id)) - function belllow
     */
    const nftMeta = computed<Map<string, NftMetaFragment>>(() => {
        const map = new Map<string, NftMetaFragment>()
        if (!loadingIds.value && !loadingMeta.value && metaResult.value && metaResult.value.getNFTTokensMeta) {
            metaResult.value.getNFTTokensMeta.nfts?.forEach(i => {
                if (i.token_id) {
                    const id = generateMapId(i.contract_address, i.token_id)
                    map.set(id, i)
                }
            })
        }
        return map
    })

    return { loadingMeta, nftMeta }
}
