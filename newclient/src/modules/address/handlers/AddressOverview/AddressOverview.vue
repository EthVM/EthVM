<template>
    <div>
        <address-detail v-if="!hasError" :address="addressDetails" :loading="loading" />
        <v-card v-else> {{ error }} </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { exchangeRate } from '@app/modules/addresses/addresses.graphql'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { getEthBalance } from './addressDetails.graphql'
import { getEthBalance_getEthBalance as BalanceType } from './getEthBalance.type'
import { Address } from '@app/modules/address/components/props'
import AddressDetail from '@app/modules/address/components/AddressDetail.vue'
import BN from 'bignumber.js'

@Component({
    components: {
        AddressDetail
    },
    apollo: {
        getEthBalance: {
            query: getEthBalance,
            variables() {
                return { hash: this.address }
            },
            update: data => data.getEthBalance
            // result(data) {
            //     console.log(data)
            //     if (data.data && data.data.getEthBalance) {
            //         this.error = ''
            //         //Fetch USD Value update
            //     } else {
            //         this.error = 'error'
            //     }
            // }
        }
    }
})
export default class AddressOverview extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(String) address!: string
    @Prop(Boolean) isMiner!: boolean
    @Prop(Boolean) isContractcreator!: boolean
    @Prop(Boolean) isContract!: boolean
    @Prop(Number) totalErc20Owned!: number

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    getEthBalance!: BalanceType
    error = ''

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
    get addressDetails(): Address {
        return {
            hash: this.address,
            balance: this.getEthBalance ? this.getEthBalance.balance : '0',
            isMiner: this.isMiner,
            isContractCreator: this.isContractcreator,
            isContract: this.isContract,
            totalERC20: this.totalErc20Owned
        }
    }

    get hasError(): boolean {
        return !(this.error === '')
    }

    get loading(): boolean {
        return this.$apollo.queries.getEthBalance.loading
    }
}
</script>
