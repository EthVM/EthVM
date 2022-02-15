<template>
    <fav-addr-table-row
        :ether-price="etherPrice"
        :hash="hash"
        :name="name"
        :eth-balance="balance"
        :chips="addrChips"
        :delete-mode="deleteMode"
        :delete-array="deleteArray"
        :check-box-method="checkBoxMethod"
        @errorFavorites="emitErrorState"
    />
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { ErrorMessagesFav } from '@app/modules/favorite-addresses/models/ErrorMessagesFav'
import { Crumb } from '@app/core/components/props'
import FavAddrTableRow from '@app/modules/favorite-addresses/components/FavAddrTableRow.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { getEthBalance } from '@app/modules/address/handlers/AddressOverview/addressDetails.graphql'
import { getContractInfo } from '@app/modules/address/handlers/AdressContractInfo/addressContractInfo.graphql'
import { getEthBalance_getEthBalance as BalanceType } from '@app/modules/address/handlers/AddressOverview/apolloTypes/getEthBalance'
import { getContractInfo_getContractMeta as ContractMeta } from '@app/modules/address/handlers/AdressContractInfo/apolloTypes/getContractInfo'
import { getAddrRewardsBlock_getBlockRewards as RewardsBlockType } from '@app/modules/address/handlers/AddressRewards/apolloTypes/getAddrRewardsBlock'
import { getAddrRewardsUncle_getUncleRewards as RewardsUncleType } from '@app/modules/address/handlers/AddressRewards/apolloTypes/getAddrRewardsUncle'
import { getAddrRewardsBlock, getAddrRewardsUncle, getAddrRewardsGenesis } from '@app/modules/address/handlers/AddressRewards/rewards.graphql'
import { AddressUpdateEvent } from '@app/modules/address/handlers/AddressUpdateEvent/AddressUpdateEvent.mixin'
import { excpAddrNotContract } from '@app/apollo/exceptions/errorExceptions'

@Component({
    components: {
        FavAddrTableRow
    },
    apollo: {
        getEthBalance: {
            query: getEthBalance,
            variables() {
                return { hash: this.hash }
            },
            update: data => data.getEthBalance,
            result(data) {
                if (data.data && data.data.getEthBalance) {
                    this.emitErrorState(false)
                }
            },
            error(error) {
                this.emitErrorState(true, ErrorMessagesFav.ethBalance)
            }
        },
        getContractInfo: {
            query: getContractInfo,
            fetchPolicy: 'cache-first',
            variables() {
                return { hash: this.hash }
            },
            update: data => data.getContractMeta,
            result(data) {
                if (data.data && data.data.getContractMeta) {
                    this.emitErrorState(false)
                    this.isContract = true
                }
            },
            error(error) {
                const newError = JSON.stringify(error.message)
                if (newError.toLowerCase().includes(excpAddrNotContract)) {
                    this.emitErrorState(false)
                    this.isContract = false
                } else {
                    this.emitErrorState(true, ErrorMessagesFav.contract)
                    this.hasError = true
                }
            }
        },
        getRewards: {
            query() {
                return this.skipUncleRewards ? getAddrRewardsBlock : getAddrRewardsUncle
            },
            fetchPolicy: 'cache-and-network',
            variables() {
                return {
                    hash: this.hash,
                    _limit: 1
                }
            },
            deep: true,
            update: data => data.getBlockRewards || data.getUncleRewards,
            result({ data }) {
                if (this.getRewards && this.getRewards.transfers && this.getRewards.transfers.length > 0) {
                    this.isMiner = true
                    this.emitErrorState(false)
                } else {
                    if (this.skipUncleRewards) {
                        this.skipUncleRewards = false
                        this.$apollo.queries.getRewards.refetch()
                    } else {
                        this.emitErrorState(false)
                        this.isMiner = false
                    }
                }
            },
            error(error) {
                this.emitErrorState(true, ErrorMessagesFav.rewards)
            }
        }
    }
})
export default class FavHandlerAddressListRow extends Mixins(AddressUpdateEvent) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Number) etherPrice!: number
    @Prop(String) name!: string
    @Prop(String) hash!: string
    @Prop(Boolean) deleteMode!: boolean
    @Prop(Array) deleteArray!: string[]
    @Prop(Function) checkBoxMethod!: string[]

    /*
    ===================================================================================
      Data
    ===================================================================================
    */

    getEthBalance: BalanceType | undefined = undefined
    getContractInfo!: ContractMeta
    hasError = false
    //CHIPS:
    isMiner = false
    isContract = false
    isContractCreator = false
    getRewards!: RewardsBlockType | RewardsUncleType
    skipUncleRewards = true
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get balance(): string | undefined {
        return this.getEthBalance ? this.getEthBalance.balance : this.getEthBalance
    }

    get isLoaded(): boolean {
        return this.getEthBalance !== undefined
    }
    get addrChips(): EnumAdrChips[] {
        const chips: EnumAdrChips[] = []
        if (this.isMiner) {
            chips.push(EnumAdrChips.miner)
        }
        if (this.isContractCreator) {
            chips.push(EnumAdrChips.creator)
        }
        if (this.isContract) {
            chips.push(EnumAdrChips.contract)
        }
        return chips
    }
    /*
    ===================================================================================
      LifeCycle:
    ===================================================================================
    */
    mounted() {
        this.setEventVariables(this.hash)
    }

    @Watch('hash')
    onHashChange(newVal: string, oldVal: string): void {
        if (newVal !== oldVal) {
            this.isMiner = false
            this.isContract = false
            this.isContractCreator = false
            this.skipUncleRewards = true
            this.setEventVariables(newVal)
        }
    }
    @Watch('addrChips')
    onAddrChipsChange(newVal: EnumAdrChips[], oldVal: EnumAdrChips[]): void {
        if (newVal.length !== oldVal.length) {
            this.$emit('addressChips', this.addrChips, this.hash)
        }
    }
    @Watch('addrBalanceChanged')
    onAddrBalanceChanged(): void {
        if (this.onAddrBalanceChanged && !this.$apollo.queries.getEthBalance.loading) {
            this.$apollo.queries.getEthBalance.refetch()
            this.resetBalance()
        }
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    emitErrorState(val: boolean, message: string): void {
        this.hasError = val
        this.$emit('errorFavorites', this.hasError, message)
    }
}
</script>
