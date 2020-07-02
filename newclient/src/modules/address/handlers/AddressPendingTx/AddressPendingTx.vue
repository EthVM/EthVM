<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :title="getTitle" :page-type="pageType" page-link="" />
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTxsHeader from '@app/modules/address/components/TableAddressTxsHeader.vue'
import TableAddressTxsRow from '@app/modules/address/components/TableAddressTxsRow.vue'
import TableAddressTokensHeader from '@app/modules/address/components/TableAddressTokensHeader.vue'
import TableAddressTransfersRow from '@app/modules/address/components/TableAddressTransfersRow.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getPendingTransactions } from './pendingTxs.graphql'
import { getPendingTransactions_getPendingTransactions as PendingTxType } from './apolloTypes/getPendingTransactions'

@Component({
    components: {
        AppTableTitle,
        TableTxs,
        TableAddressTxsRow,
        TableAddressTxsHeader,
        TableAddressTokensHeader,
        TableAddressTransfersRow
    },
    apollo: {
        getPendingTx: {
            query: getPendingTransactions,
            varibles() {
                return {
                    owner: this.address
                }
            },
            update: data => data.getPendingTransactions,
            result({data}) {
              console.error('data', data)
            }
        }
    }
})
export default class AddressPendingTx extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(String) address!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    pageType = 'address'
    getPendingTx!: PendingTxType

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get getTitle(): string {
      console.error('hello', this.getPendingTx)
        return `${this.$tc('tx.pending', 2)}`
    }
}
</script>
