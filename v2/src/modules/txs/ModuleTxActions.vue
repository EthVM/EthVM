<template>
    <div class="pt-3 pb-4 pb-sm-6">
        <div v-if="!actionsLoading">
            <div v-if="ethTransfers.length > 0" class="mb-13 mb-sm-10">
                <app-expansion-panel :title="`${currencyName} ${$t('common.transfer')}`">
                    <template #visible-content>
                        <div v-if="!initialLoadingEthTransfers && !loadingEthTransfersData">
                            <div v-for="(transfer, index) in currentPageData.slice(0, 3)" :key="`${index}`">
                                <tx-action-row :transfer="transfer" />
                            </div>
                        </div>
                        <div v-else>
                            <div v-for="item in 3" :key="item" style="padding: 10px 0">
                                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                            </div>
                        </div>
                    </template>
                    <template #expand-content v-if="ethTransfers.length > 3">
                        <div v-if="!initialLoadingEthTransfers && !loadingEthTransfersData">
                            <template v-if="ethTransfers">
                                <div v-for="(transfer, index) in currentPageData.slice(3, LIMIT)" :key="`${index}`">
                                    <tx-action-row :transfer="transfer" />
                                </div>
                            </template>
                        </div>
                        <div v-else>
                            <div v-for="item in 7" :key="item" style="padding: 10px 0">
                                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                            </div>
                        </div>
                        <template v-if="showPaginationEthTransfers">
                            <app-pagination
                                :length="numberOfPages"
                                :has-more="hasMoreEthTransfers"
                                @update:modelValue="loadMoreEthTransfers"
                                :current-page="pageNum"
                            />
                        </template>
                    </template>
                </app-expansion-panel>
            </div>
            <div v-if="erc20Transfers.length > 0" class="mb-13 mb-sm-10">
                <app-expansion-panel :title="$t('txs.details.actions.tokenTransfers')">
                    <template #visible-content>
                        <div v-if="!initialLoadingErc20Transfers && !loadingErc20TransfersData">
                            <div v-for="(transfer, index) in currentPageDataErc20.slice(0, 3)" :key="`${index}`">
                                <tx-action-row :transfer="transfer" />
                            </div>
                        </div>
                        <div v-else>
                            <div v-for="item in 3" :key="item" style="padding: 10px 0">
                                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                            </div>
                        </div>
                    </template>
                    <template #expand-content v-if="erc20Transfers.length > 3">
                        <div v-if="!initialLoadingErc20Transfers && !loadingErc20TransfersData">
                            <template v-if="erc20Transfers">
                                <div v-for="(transfer, index) in currentPageDataErc20.slice(3, LIMIT)" :key="`${index}`">
                                    <tx-action-row :transfer="transfer" />
                                </div>
                            </template>
                        </div>
                        <div v-else>
                            <div v-for="item in 7" :key="item" style="padding: 10px 0">
                                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                            </div>
                        </div>
                        <template v-if="showPaginationErc20Transfers">
                            <app-pagination
                                :length="numberOfPagesErc20"
                                :has-more="hasMoreErc20Transfers"
                                @update:modelValue="loadMoreErc20Transfers"
                                :current-page="pageNumErc20"
                            />
                        </template>
                    </template>
                </app-expansion-panel>
            </div>
            <div v-if="nftTransfers.length > 0" class="mb-13 mb-sm-10">
                <app-expansion-panel :title="$t('txs.details.actions.nftTransfers')">
                    <template #visible-content>
                        <div v-if="!initialLoadingNftTransfers && !loadingNftTransfersData && !loadingMeta">
                            <div v-for="(transfer, index) in currentPageDataNFT.slice(0, 3)" :key="`${index}`">
                                <tx-action-row :transfer="transfer" :nft-meta="getRowMeta(transfer.tokenInfo?.contract, transfer.nftId)" />
                            </div>
                        </div>
                        <div v-else>
                            <div v-for="item in 3" :key="item" style="padding: 10px 0">
                                <div class="skeleton-box rounded-xl" style="height: 50px"></div>
                            </div>
                        </div>
                    </template>
                    <template #expand-content v-if="nftTransfers.length > 3">
                        <div v-if="!initialLoadingNftTransfers && !loadingNftTransfersData && !loadingMeta">
                            <template v-if="nftTransfers">
                                <div v-for="(transfer, index) in currentPageDataNFT.slice(3, LIMIT)" :key="`${index}`">
                                    <tx-action-row :transfer="transfer" :nft-meta="getRowMeta(transfer.tokenInfo?.contract, transfer.nftId)" />
                                </div>
                            </template>
                        </div>
                        <div v-else>
                            <div v-for="item in 7" :key="item" style="padding: 10px 0">
                                <div class="skeleton-box rounded-xl" style="height: 50px"></div>
                            </div>
                        </div>
                        <template v-if="showPaginationNFTTransfers">
                            <app-pagination
                                :length="numberOfPagesNFT"
                                :has-more="hasMoreNftTransfers"
                                @update:modelValue="loadMoreNftTransfers"
                                :current-page="pageNumNFT"
                            />
                        </template>
                    </template>
                </app-expansion-panel>
            </div>
            <app-no-result v-if="!hasActions" :text="$t('message.txNoactions')" class="mx-4 mx-sm-6"></app-no-result>
        </div>
        <template v-else>
            <div v-for="item in 3" :key="item" class="px-4 px-sm-6 mb-4 mb-sm-6">
                <div class="skeleton-box rounded-xl" style="height: 300px"></div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import AppExpansionPanel from '@/core/components/AppExpansionPanel.vue'
import TxActionRow from './components/TxActionRow.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed } from 'vue'
import {
    EthTransferInTxFragment as EthTransfer,
    useGetEthTransfersInTxQuery,
    useGetErc20TransfersInTxQuery,
    Erc20TransferInTxFragment as ERC20Transfer,
    useGetNftTransfersInTxQuery,
    NftTransferInTxFragment as NFTTransfer
} from '@module/txs/apollo/Actions/actionsQueries.generated'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { Action } from './types/index'
import { useNetwork } from '@/core/composables/Network/useNetwork'
import { useGetNftsMeta } from '@core/composables/NftMeta/useGetNftsMeta.composable'
import { NftId, generateId, generateMapId } from '@/core/composables/NftMeta/helpers'
import { NftMetaFragment } from '@core/composables/NftMeta/nftMeta.generated'

const LIMIT = 10
const { currencyName } = useNetwork()

const props = defineProps({
    txHash: {
        type: String,
        required: true
    }
})

/** -------------------
 * Eth Transfers
 * --------------------*/

const {
    result: ethTransfersData,
    loading: loadingEthTransfersData,
    fetchMore: fetchMoreEthTransfersData
} = useGetEthTransfersInTxQuery(
    () => ({
        hash: props.txHash,
        limit: LIMIT
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const ethTransfers = computed<Action[]>(() => {
    return (
        ethTransfersData.value?.getEthTransfersByHash.transfers
            .filter((x): x is EthTransfer => x !== null)
            .map(i => {
                return {
                    from: i.transfer.from,
                    to: i.transfer.to,
                    value: i.value,
                    type: i.transfer.type
                }
            }) || []
    )
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(ethTransfers, 'ethTransfers', LIMIT)

const initialLoadingEthTransfers = computed<boolean>(() => {
    return !ethTransfersData.value
})

const hasMoreEthTransfers = computed<boolean>(() => {
    return !!ethTransfersData.value?.getEthTransfersByHash.nextKey
})

const showPaginationEthTransfers = computed<boolean>(() => {
    return !initialLoadingEthTransfers.value && (ethTransfers.value.length > LIMIT || hasMoreEthTransfers.value)
})

const loadMoreEthTransfers = (pageNum: number): void => {
    setPageNum(pageNum)
    if (pageNum > numberOfPages.value && hasMoreEthTransfers.value) {
        fetchMoreEthTransfersData({
            variables: {
                hash: props.txHash,
                nextKey: ethTransfersData.value?.getEthTransfersByHash.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getEthTransfersByHash: {
                        nextKey: fetchMoreResult?.getEthTransfersByHash.nextKey,
                        transfers: [...prev.getEthTransfersByHash.transfers, ...(fetchMoreResult?.getEthTransfersByHash.transfers || [])],
                        __typename: fetchMoreResult?.getEthTransfersByHash.__typename
                    }
                }
            }
        })
    }
}

/** -------------------
 * ERC20 Transfers
 * --------------------*/

const {
    result: erc20TransfersData,
    loading: loadingErc20TransfersData,
    fetchMore: fetchMoreErc20TransfersData
} = useGetErc20TransfersInTxQuery(
    () => ({
        hash: props.txHash,
        limit: LIMIT
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const erc20Transfers = computed<Action[]>(() => {
    return (
        erc20TransfersData.value?.getERC20TransfersByHash.transfers
            .filter((x): x is ERC20Transfer => x !== null)
            .map(i => {
                return {
                    from: i.transfer.from,
                    to: i.transfer.to,
                    value: i.value,
                    type: i.transfer.type,
                    tokenInfo: {
                        contract: i.contract,
                        tokenInfo: {
                            name: i.tokenInfo.name,
                            symbol: i.tokenInfo.symbol,
                            decimals: i.tokenInfo.decimals,
                            iconPng: i.tokenInfo.iconPng
                        }
                    }
                }
            }) || []
    )
})

const {
    numberOfPages: numberOfPagesErc20,
    pageData: currentPageDataErc20,
    pageNum: pageNumErc20,
    setPageNum: setPageNumErc20
} = useAppPaginate(erc20Transfers, 'erc20Transfers', LIMIT)

const initialLoadingErc20Transfers = computed<boolean>(() => {
    return !erc20TransfersData.value
})

const hasMoreErc20Transfers = computed<boolean>(() => {
    return !!erc20TransfersData.value?.getERC20TransfersByHash.nextKey
})

const showPaginationErc20Transfers = computed<boolean>(() => {
    return !initialLoadingErc20Transfers.value && (erc20Transfers.value.length > LIMIT || hasMoreErc20Transfers.value)
})

const loadMoreErc20Transfers = (pageNum: number): void => {
    setPageNumErc20(pageNum)
    if (pageNum > numberOfPagesErc20.value && hasMoreErc20Transfers.value) {
        fetchMoreErc20TransfersData({
            variables: {
                hash: props.txHash,
                nextKey: erc20TransfersData.value?.getERC20TransfersByHash.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getERC20TransfersByHash: {
                        nextKey: fetchMoreResult?.getERC20TransfersByHash.nextKey,
                        transfers: [...prev.getERC20TransfersByHash.transfers, ...(fetchMoreResult?.getERC20TransfersByHash.transfers || [])],
                        __typename: fetchMoreResult?.getERC20TransfersByHash.__typename
                    }
                }
            }
        })
    }
}

/** -------------------
 * NFT Transfers
 * --------------------*/

const {
    result: nftTransfersData,
    loading: loadingNftTransfersData,
    fetchMore: fetchMoreNftTransfersData
} = useGetNftTransfersInTxQuery(
    () => ({
        hash: props.txHash,
        limit: LIMIT
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const nftTransfers = computed<Action[]>(() => {
    return (
        nftTransfersData.value?.getNFTTransfersByHash.transfers
            .filter((x): x is NFTTransfer => x !== null)
            .map(i => {
                return {
                    from: i.transfer.from,
                    to: i.transfer.to,
                    value: i.value || '0x',
                    type: i.transfer.type,
                    nftId: i.tokenId,
                    tokenInfo: {
                        contract: i.contract,
                        tokenInfo: {
                            name: i.tokenInfo.name,
                            symbol: i.tokenInfo.symbol,
                            decimals: i.tokenInfo.decimals,
                            iconPng: i.tokenInfo.iconPng
                        }
                    }
                }
            }) || []
    )
})

const {
    numberOfPages: numberOfPagesNFT,
    pageData: currentPageDataNFT,
    pageNum: pageNumNFT,
    setPageNum: setPageNumNFT
} = useAppPaginate(nftTransfers, 'nftTransfers', LIMIT)

/**
 * Computed Property of token ids to fetch meta
 */
const tokenIDS = computed<NftId[]>(() => {
    const _ids: NftId[] = []
    if (!loadingNftTransfersData.value && nftTransfers.value.length > 0 && generateId) {
        currentPageDataNFT.value.forEach(i => {
            if (i && i.nftId && i.tokenInfo?.contract) {
                const id = {
                    id: generateId(i.nftId),
                    contract: i.tokenInfo.contract
                }
                _ids.push(id)
            }
        })
    }
    return _ids
})

const { nftMeta, loadingMeta } = useGetNftsMeta(tokenIDS, loadingNftTransfersData)

const getRowMeta = (contract: string | undefined, id: string | undefined): NftMetaFragment | undefined => {
    return contract && id ? nftMeta.value.get(generateMapId(contract, id)) : undefined
}
const initialLoadingNftTransfers = computed<boolean>(() => {
    return !nftTransfersData.value && !loadingMeta.value
})

const hasMoreNftTransfers = computed<boolean>(() => {
    return !!nftTransfersData.value?.getNFTTransfersByHash.nextKey
})

const showPaginationNFTTransfers = computed<boolean>(() => {
    return !initialLoadingNftTransfers.value && (nftTransfers.value.length > LIMIT || hasMoreNftTransfers.value)
})

const loadMoreNftTransfers = (pageNum: number): void => {
    setPageNumNFT(pageNum)
    if (pageNum > numberOfPagesNFT.value && hasMoreNftTransfers.value) {
        fetchMoreNftTransfersData({
            variables: {
                hash: props.txHash,
                nextKey: nftTransfersData.value?.getNFTTransfersByHash.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getNFTTransfersByHash: {
                        nextKey: fetchMoreResult?.getNFTTransfersByHash.nextKey,
                        transfers: [...prev.getNFTTransfersByHash.transfers, ...(fetchMoreResult?.getNFTTransfersByHash.transfers || [])],
                        __typename: fetchMoreResult?.getNFTTransfersByHash.__typename
                    }
                }
            }
        })
    }
}

/** -------------------
 * Actions
 * --------------------*/
const actionsLoading = computed<boolean>(() => {
    return initialLoadingEthTransfers.value || initialLoadingErc20Transfers.value || initialLoadingNftTransfers.value
})

const hasActions = computed<boolean>(() => {
    return ethTransfers.value.length > 0 || erc20Transfers.value.length > 0 || nftTransfers.value.length > 0
})
</script>
