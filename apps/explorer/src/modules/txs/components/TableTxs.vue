<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 pb-2">
    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->
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
      <v-flex v-else xs12 sm7 md6>
        <v-layout v-if="pages > 1 && !hasError" justify-end row class="pb-1 pr-2 pl-2">
          <app-paginate :total="pages" @newPage="setPage" :new-page="page" :has-first="false" :has-last="false" :has-input="false" />
        </v-layout>
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      LOADING / ERROR
    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-card v-if="!hasError" color="info" flat class="white--text pl-3 pr-1" height="40px">
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
    <!--
    =====================================================================================
      TABLE BODY
    =====================================================================================
    -->
    <v-card flat v-if="!hasError" id="scroll-target" :style="getStyle" class="scroll-y" style="overflow-x: hidden">
      <v-layout column fill-height class="mb-1" v-scroll:#scroll-target>
        <v-flex xs12 v-if="!loading">
          <v-card v-for="tx in transactions" class="transparent" flat :key="tx.getHash()">
            <table-txs-row :tx="tx" :is-pending="pending" />
            <v-divider class="mb-2 mt-2" />
          </v-card>
          <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2">
            <app-paginate :total="pages" @newPage="setPage" :current-page="page" :has-first="false" :has-last="false" :has-input="false" />
          </v-layout>
        </v-flex>
        <v-flex xs12 v-if="loading">
          <div v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
              <v-flex xs6 sm8 md5>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex hidden-xs-only sm3 md2>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex hidden-xs-only v-if="!pending" sm1>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError2.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableTxsRow from '@app/modules/txs/components/TableTxsRow.vue'
import { PendingTx, Tx, SimpleTx } from '@app/core/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  components: {
    AppError,
    AppPaginate,
    TableTxsRow
  }
})
export default class TableTxs extends Vue {
  @Prop({ type: Boolean, default: true }) loading: boolean
  @Prop(String) pageType: string
  @Prop(String) showStyle!: string
  @Prop(Array) transactions!: Tx[] | PendingTx[] | SimpleTx[]
  @Prop({ type: Number, default: 0 }) totalTxs: number
  @Prop(Number) maxItems!: number
  @Prop(String) error: string

  page = 0

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('getTxsPage', this.page)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setPage(value: number): void {
    this.page = value
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasError(): boolean {
    return this.error !== ''
  }

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
