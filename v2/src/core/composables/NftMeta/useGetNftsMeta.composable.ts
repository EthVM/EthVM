import { computed, Ref } from 'vue'
import { useGetNftTokensMetaQuery, NftMetaFragment } from './nftMeta.generated'
import { NftId, generateId, generateMapId } from './helpers'

export function useGetNftsMeta(tokenIds: Ref<NftId[]>, loadingIds: Ref<boolean>) {
    /**
     * Functions generates id to be used in the fetch useGetNftTokensMetaQuery
     */
    const generateFetchId = (tokens: NftId[]): string => {
        let ids = ''
        tokens.forEach(i => {
            const id = generateId(i.id)
            ids = `${ids}ethereum.${i.contract}.${id},`
        })
        return ids
    }
    /**
     * Computed Property of the original ids to fetch
     * NOTE: Once pagination pr is implemented use end in slice to be equal to the number of items per page
     * Triggers apollo call based on the ids.
     * Will not be triggered if more ids are added, use fetchMore
     */
    const ids = computed<string>(() => {
        if (tokenIds.value.length > 0) {
            // //Make sure end in slice === to page limit
            const first = tokenIds.value.slice(0, 10)
            return generateFetchId(first)
        }
        return ''
    })

    const {
        result: metaResult,
        loading: loadingMeta,
        fetchMore: fetchMoreNftTokensMeta,
        refetch
    } = useGetNftTokensMetaQuery(
        () => ({
            input: ids.value
        }),
        () => ({
            clientId: 'nftClient',
            enabled: ids.value !== ''
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

    /**
     * Functions fetches more ids and adds them the previous result array
     * @ids {NftId[]} - new ids to fetch
     */
    const fetchMoreNft = (_ids: NftId[]) => {
        fetchMoreNftTokensMeta({
            variables: {
                input: generateFetchId(_ids)
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const newT = fetchMoreResult?.getNFTTokensMeta?.nfts
                const prevT: NftMetaFragment[] = previousResult?.getNFTTokensMeta?.nfts || []
                const nfts = newT ? [...prevT, ...newT] : [...prevT]
                return {
                    getNFTTokensMeta: {
                        nfts,
                        __typename: previousResult?.getNFTTokensMeta?.__typename
                    }
                }
            }
        })
    }

    return { loadingMeta, nftMeta, refetch, fetchMoreNft }
}
