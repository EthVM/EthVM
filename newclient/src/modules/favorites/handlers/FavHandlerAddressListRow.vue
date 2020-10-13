<template>
    <fav-addr-table-row :ether-price="etherPrice" :hash="hash" :name="name" :eth-balance="balance" :chips="addrChips" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ErrorMessagesFav } from '@app/modules/favorites/models/ErrorMessagesFav'
import { Crumb } from '@app/core/components/props'
import FavAddrTableRow from '@app/modules/favorites/components/FavAddrTableRow.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { getEthBalance, getContractMeta } from '@app/modules/address/handlers/AddressOverview/addressDetails.graphql'
import { getEthBalance_getEthBalance as BalanceType } from '@app/modules/address/handlers/AddressOverview/apolloTypes/getEthBalance'
import { getContractMeta_getContractMeta as ContractMeta } from '@app/modules/address/handlers/AddressOverview/apolloTypes/getContractMeta'
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
                // if (data.data && data.data.getEthBalance) {
                //     this.hasError = false
                //     this.emitErrorState()
                // }
            }
            // error(error) {
            //     this.hasError = true
            //     this.emitErrorState()
            // }
        },
        getContractMeta: {
            query: getContractMeta,
            fetchPolicy: 'cache-first',
            variables() {
                return { hash: this.address }
            },
            update: data => data.getContractMeta,
            result(data) {
                if (data.data && data.data.getContractMeta) {
                    this.hasError = false
                    this.isCreator = true
                } else {
                    this.isContract = false
                }
            },
            error(error) {
                const newError = JSON.stringify(error.message)
                if (newError.includes('No contract found')) {
                    this.hasError = false
                    this.isContract = false
                } else {
                    this.hasError = true
                }
            }
        }
    }
})
export default class FavHandlerAddressListRow extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Number) etherPrice!: number
    @Prop(String) name!: string
    @Prop(String) hash!: string

    /*
    ===================================================================================
      Data
    ===================================================================================
    */

    getEthBalance: BalanceType | undefined = undefined
    getContractMeta!: ContractMeta
    hasError = false
    //CHIPS:
    isMiner = false
    isContract = false
    isContractCreator = false
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
}
</script>
