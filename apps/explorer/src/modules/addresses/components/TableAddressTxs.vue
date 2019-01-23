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
              <v-select
                solo
                flat
                hide-details
                v-model="selected"
                class="primary body-1"
                :items="options"
                item-text="text"
                item-value="value"
                height="32px"
              />
            </v-card>
          </v-flex>
          <!-- End Tx Input Filter -->
        </v-layout>
      </v-flex>
      <v-flex d-flex xs12 sm8 md7>
        <v-layout justify-start class="pl-3"><app-footnotes :footnotes="footnote"/></v-layout>
      </v-flex>

      <v-flex v-if="getTotal > 0">
        <v-pagination
        v-model="page"
        flat
        :length="length"
        :total-visible="5"
        />
      </v-flex>
    </v-layout>
    <!-- Tx Table Content -->
    <table-address-tx-row v-if="!loading" :transactions="filteredTxs" :account="address" :filter="selectedTx" :total="getTotal" :type="isPending" />
    <app-info-load v-else />
    <!-- End Tx Table Content -->
  </v-card>
</template>

<script lang="ts">
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import TableAddressTxRow from '@app/modules/addresses/components/TableAddressTxRow.vue'
import { Tx } from '@app/core/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

const MAX_TXS = 5
@Component({
  components: {
    AppInfoLoad,
    AppFootnotes,
    TableAddressTxRow
  }
})
export default class TableAddressTxs extends Vue {
  @Prop(String) address!: string
  @Prop(Array) txs!: Tx[]
  @Prop({type: Number, default: 0}) totalTxs!: number
  @Prop(Array) inTxs!: Tx[]
  @Prop({type: Number, default: 0}) totalIn!: number
  @Prop(Array) outTxs!: Tx []
  @Prop({type: Number, default: 0}) totalOut!: number
  @Prop({type: Boolean, default: false}) isPending!: boolean
  @Prop({ type: Boolean, default: true }) loading!: boolean

  filtered = this.txs
  page=1
  selected=0
  pageLength = this.totalTxs

  /*Watch: */
  @Watch('selected')
  onSelectedChanged(newVal: number, oldVal: number): void {
    if(newVal === 0) {
      this.filtered = this.txs
      this.pageLength = this.totalTxs
    }
    if(newVal === 1) {
      this.filtered = []
      this.pageLength = this.totalIn
    }
    if(newVal === 2) {
      this.filtered = []
      this.pageLength = this.totalOut
    }
  }

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    if (page === 1) {
      this.filtred.s
    }
  }

  /* Computed: */
  get selectedTx() {
    return this.selected
  }

  get filteredTxs() {
    return this.filtered
  }

  get getTotal() {
    return this.filtered? this.filtered.length : 0
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
  get length() {
    return Math.ceil(this.pageLength/this.MAX_TXS)
  }
}
</script>
