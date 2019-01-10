<template>
  <v-container v-if="transaction != null" grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-start class="mb-4" v-if="tx">
      <v-flex xs12>
        <app-list-details :items="txDetails" :more-items="txMoreDetails" :details-type="detailsType" :loading="txLoad">
          <app-list-title slot="details-title" :list-type="detailsType"></app-list-title>
        </app-list-details>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Tx } from '@app/models'
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppListDetails from '@app/components/ui/AppListDetails.vue'
import AppListTitle from '@app/components/ui/AppListTitle.vue'
import { TxDetailsMixin } from '@app/components/mixins/mixin-details-txs'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    AppBreadCrumbs,
    AppListDetails,
    AppListTitle
  }
})
export default class PageDetailsTxs extends Mixins(TxDetailsMixin) {
  @Prop({ type: String }) txHash!: string

  data() {
    return {
      txLoad: true,
      transaction: null,
      items: [
        {
          text: this.$i18n.t('title.tx'),
          disabled: false,
          link: '/txs'
        },
        {
          text: this.$i18n.t('common.tx') + ': ' + this.txHash,
          disabled: true
        }
      ],
      detailsType: 'tx'
    }
  }

  // Lifecycle
  created() {
    /* Get Tx Info */
    this.$socket.emit(
      Events.getTx,
      {
        hash: this.txHash.replace('0x', '')
      },
      (err, data) => {
        if (data) {
          this.transaction = new Tx(data)
          this.setDetails(this.transaction)
          this.setMore(this.transaction)
          this.txLoad = false
          //this.setMore(this.transaction)
          /* Method to get Subtransactions: */
        }
        else {
          this.txLoad = false
        }
      }
    )
  }

  // Computed
  get tx(): Tx {
    return this.transaction
  }
}
</script>
