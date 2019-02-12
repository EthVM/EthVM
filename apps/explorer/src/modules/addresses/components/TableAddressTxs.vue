<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2">
    <!-- Tx Header -->
    <v-layout align-center justify-space-between wrap row fill-height>
      <!-- Search Box -->
      <!-- <v-flex d-flex xs12 sm6 md4>
        <v-layout row align-center justify-start fill-height height="40px">
          <v-flex xs7 sm9 md10 pr-0>
            <v-card
              flat
              style="border-top: solid 1px #efefef; border-left: solid 1px #efefef; border-bottom: solid 1px #efefef;"
              height="36px"
              class="pr-3 pl-3 pt-2"
            >
              <input :placeholder="$t('search.addressTx')" v-model="searchInput" class="width: 100%" />
            </v-card>
          </v-flex>
          <v-flex xs7 sm3 md2 pl-0>
            <v-btn depressed outline class="primary--text text-capitalize ml-0 lineGrey" @click="searching">{{ $t('search.title') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-flex> -->
      <!-- End Search Box -->
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
      <v-flex xs12>
        <v-layout row wrap align-end>
          <v-flex sm4 md3 hidden-xs-only >
            <v-layout justify-start row class="pl-3 pb-1"><app-footnotes :footnotes="footnote"/></v-layout>
          </v-flex>
          <v-spacer/>
          <v-flex xs12 sm7 md6 >
            <v-layout justify-end row class="pb-1 pr-2 pl-2" v-if="pages > 1">
              <app-paginate :total="pages" @newPage="setPage" :newPage="page"/>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Tx Table Content -->
    <table-address-tx-row v-if="!loading" :transactions="txs" :account="address" :filter="selected" :type="isPending" />
    <app-info-load v-else />
      <v-layout justify-end row class="pb-1 pr-2 pl-2" v-if="pages > 1">
        <app-paginate :total="pages" @newPage="setPage" :newPage="page"/>
      </v-layout>
  </v-card>
</template>

<script lang="ts">
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableAddressTxRow from '@app/modules/addresses/components/TableAddressTxRow.vue'
import { Tx } from '@app/core/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

const MAX_TXS = 10
@Component({
  components: {
    AppInfoLoad,
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

  page = 1
  selected = 0
  filter = ['all', 'in', 'out']


  /*Methods: */
  setPage(_value: number): void {
    this.page = _value
  }

  /*Watch: */
  @Watch('selected')
  onSelectedChanged(newVal: number, oldVal: number): void {
    this.page = 1
    this.$emit('filter', this.filter[newVal], 0)
  }

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('filter', this.filter[this.selected], newVal - 1)
  }

  /* Computed: */
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
