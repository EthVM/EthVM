<template>
  <v-card color="white" flat class="pr-2 pl-2">
    <!--
    =====================================================================================
      LOADING / ERROR
    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="loading" class="mt-0" />
    <app-error :has-error="hasError" :message="error" />
    <!--
    =====================================================================================
      TABLE / TAB
    =====================================================================================
    -->
    <!-- Tx Header -->
    <v-layout align-center justify-space-between wrap row fill-height>
      <!-- Tx Input Filter -->
      <v-flex d-flex xs12 sm4 md3>
        <v-layout row align-center justify-start fill-height height="40px">
          <v-flex>
            <p class="pr-2 ma-0">{{ $t('filter.view') }}:</p>
          </v-flex>
          <v-flex>
            <v-card flat style="border: solid 1px #efefef; padding-top: 1px;" height="36px" class="pl-2">
              <v-select solo flat hide-details v-model="selected" class="primary body-1" :items="options" item-text="text" item-value="value" height="32px" />
            </v-card>
          </v-flex>
          <!-- End Tx Input Filter -->
        </v-layout>
      </v-flex>
      <v-flex xs12 mb-2>
        <v-layout row wrap align-end>
          <v-flex sm4 md3 hidden-xs-only>
            <v-layout justify-start row class="pl-3 pb-1"><app-footnotes :footnotes="footnote"/></v-layout>
          </v-flex>
          <v-spacer />
          <v-flex xs12 sm7 md6>
            <v-layout justify-end row class="pb-1 pr-2 pl-2" v-if="pages > 1">
              <app-paginate :total="pages" @newPage="setPage" :new-page="page" :has-first="false" :has-last="false" :has-input="false" />
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Tx Table Content -->
    <v-card color="white" flat class="pt-0 pb-2">
      <!-- Table Header -->
      <v-card color="primary" flat class="white--text pl-3 pr-1" height="40px">
        <v-layout align-center justify-start row fill-height pr-3>
          <v-flex xs9 sm9 md5 pl-3>
            <h5>{{ $t('tableHeader.txN') }}</h5>
          </v-flex>
          <v-flex xs3 sm2 md2>
            <h5>{{ $t('common.eth') }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down md2>
            <h5>{{ $t('gas.limit') }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down md2>
            <h5>{{ $t('common.gwei') }}</h5>
          </v-flex>
          <v-flex hidden-xs-only sm1>
            <h5>{{ $t('common.status') }}</h5>
          </v-flex>
        </v-layout>
      </v-card>
      <table-address-tx-row v-if="!loading" :transactions="txs" :account="address" :filter="selected" :type="isPending" />
      <v-card v-if="loading" color="white" flat class="pt-0 pb-2">
        <v-flex xs12>
          <div v-for="i in maxTxs" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
              <v-flex xs6 sm2 order-xs1>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex xs12 sm7 md6>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md2 order-xs4 order-sm3>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </v-flex>
      </v-card>
    </v-card>
    <v-layout justify-end row class="pb-1 pr-2 pl-2" v-if="pages > 1">
      <app-paginate :total="pages" @newPage="setPage" :new-page="page" :has-first="false" :has-last="false" :has-input="false" />
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError2.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableAddressTxRow from '@app/modules/addresses/components/TableAddressTxRow.vue'
import { Tx } from '@app/core/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

const MAX_TXS = 10

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppPaginate,
    TableAddressTxRow
  }
})
export default class TableAddressTxs extends Vue {
  @Prop(String) address!: string
  @Prop({ type: Array, default: [] }) txs!: Tx[]
  @Prop({ type: Number, default: 0 }) totalTxs!: number
  @Prop({ type: Boolean, default: false }) isPending!: boolean
  @Prop({ type: Boolean, default: true }) loading!: boolean
  @Prop(String) error: string

  page = 0
  selected = 0
  filter = ['all', 'in', 'out']

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setPage(_value: number): void {
    this.page = _value
  }

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  @Watch('selected')
  onSelectedChanged(newVal: number, oldVal: number): void {
    this.page = 0
    this.$emit('filter', this.filter[newVal], 0)
  }

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('filter', this.filter[this.selected], newVal)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get hasError(): boolean {
    return this.error !== ''
  }

  get maxTxs(): number {
    return MAX_TXS
  }

  get options() {
    return [
      {
        text: this.$i18n.t('filter.all'),
        value: 0
      },
      {
        text: this.$i18n.t('filter.in'),
        value: 1
      },
      {
        text: this.$i18n.t('filter.out'),
        value: 2
      }
    ]
  }

  get footnote() {
    return [
      {
        color: 'success',
        text: this.$i18n.t('filter.in'),
        icon: 'fa fa-circle'
      },
      {
        color: 'error',
        text: this.$i18n.t('filter.out'),
        icon: 'fa fa-circle'
      }
    ]
  }

  get pages(): number {
    return Math.ceil(this.totalTxs / MAX_TXS)
  }
}
</script>
