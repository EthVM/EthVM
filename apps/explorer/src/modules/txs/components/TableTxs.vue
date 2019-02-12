<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 pb-2">
    <v-layout row wrap align-center pb-1>
      <v-flex xs4 md5>
        <v-card-title class="title font-weight-bold">{{ getTitle }}</v-card-title>
      </v-flex>
      <v-spacer />
      <v-flex xs4 v-if="pageType == 'home'">
        <v-layout justify-end>
          <v-btn outline color="secondary" class="text-capitalize" to="/txs">{{ $t('bttn.viewAll') }}</v-btn>
        </v-layout>
      </v-flex>
      <v-flex v-else xs12 sm7 md6 >
        <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2" >
          <app-paginate :total="pages" @newPage="setPage" :newPage="page"/>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md5>
          <h5>{{ $t('tableHeader.txN') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm3 md2>
          <h5>{{ $t('common.eth') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('gas.limit') }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('common.gwei') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only v-if="!pending" sm1>
          <h5>{{ $t('common.status') }}</h5>
        </v-flex>
        <v-flex v-else hidden-xs-and-up></v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->
    <app-info-load v-if="loading" />
    <v-card v-else flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target style="margin-right: 1px" class="mb-1">
        <v-flex xs12>
          <v-card v-for="tx in transactions" class="transparent" flat :key="tx.getHash()">
            <table-txs-row :tx="tx" :is-pending="pending" />
            <v-divider class="mb-2 mt-2" />
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout  v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2" >
        <app-paginate :total="pages" @newPage="setPage" :newPage="page"/>
      </v-layout>
    </v-card>
    <!-- Hadle error - No Txs History
    <div v-else>
      <v-card flat class="mt-3 mb-3">
        <v-card-text
          v-if="!pending"
          class="text-xs-center text-muted"
        >{{ $t('message.noTxHistory') }}</v-card-text>
        <v-card-text v-else class="text-xs-center text-muted">{{ $t('message.noPending') }}</v-card-text>
      </v-card>
    </div>-->
  </v-card>
</template>

<script lang="ts">
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableTxsRow from '@app/modules/txs/components/TableTxsRow.vue'
import { PendingTx, Tx } from '@app/core/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  components: {
    AppInfoLoad,
    AppPaginate,
    TableTxsRow
  }
})
export default class TableTxs extends Vue {
  @Prop({ type: Boolean, default: true }) loading: boolean
  @Prop(String) pageType: string
  @Prop(String) showStyle!: string
  @Prop(Array) transactions!: Tx[] | PendingTx[]
  @Prop({ type: Number, default: 0 }) totalTxs: number
  @Prop(Number) maxItems!: number
  page = 1

  /*Methods: */
  setPage(_value: number): void {
    this.page = _value
  }

  /* Watch: */
  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('getTxsPage',  newVal - 1)
  }

  /* Computed: */
  get footnote() {
    return [
      {
        color: 'success',
        text: this.$i18n.t('footnote.success'),
        icon: 'fa-check-circle'
      },
      {
        color: 'warning',
        text: this.$i18n.t('footnote.failed'),
        icon: 'fa fa-times-circle'
      }
    ]
  }

  get getStyle(): string {
    return this.showStyle
  }

  get titles() {
    return {
      tx: this.$i18n.t('title.lastTxs'),
      pending: this.$i18n.t('title.pending'),
      block: this.$i18n.t('title.blockTxs')
    }
  }

  get getTitle(): string {
    return this.titles[this.pageType] || this.titles['tx']
  }

  get pending(): boolean {
    return this.pageType == 'pending'
  }
  get pages(): number {
    return this.totalTxs ? Math.ceil(this.totalTxs / this.maxItems) : 0
  }
}
</script>
