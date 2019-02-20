<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 pb-2">
    <!--
      =====================================================================================
        TITLE
      =====================================================================================
      -->
    <v-layout row wrap align-center pb-1>
      <v-flex xs12 sm4 md6>
        <v-layout row align-end justify-start>
          <v-card-title class="title font-weight-bold">{{ $t('title.tokens') }}</v-card-title>
          <v-card-title class="info--text">(Total: {{totalTokens}} Tokens)</v-card-title>
        </v-layout>
      </v-flex>
      <v-spacer />
      <v-flex v-if="pages > 1 && !hasError" xs12 sm7 md6>
        <v-layout justify-end row class="pb-1 pr-2 pl-2">
          <app-paginate :total="pages" @newPage="setPage" :new-page="page" />
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
        <v-flex xs1>
        </v-flex>
        <v-flex xs2>
          <h5>Token Name</h5>
        </v-flex>
        <v-flex xs2>
          <h5>Price</h5>
        </v-flex>
        <v-flex xs1>
          <h5>%Change(24H)</h5>
        </v-flex>
        <v-flex xs3>
          <h5>Volume</h5>
        </v-flex>
        <v-flex xs3>
          <h5>Market Cap</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!--
      =====================================================================================
        TABLE BODY
      =====================================================================================
      -->

    <v-card flat v-if="!hasError" id="scroll-target" :style="getStyle" class="scroll-y" style="overflow-x: hidden">
      <v-layout column fill-height class="mb-1" v-scroll:#scroll-target>
        <!-- <v-flex xs12 v-if="!loading">
              <v-card v-for="tx in transactions" class="transparent" flat :key="tx.getHash()">
                <table-txs-row :tx="tx" :is-pending="pending" />
                <v-divider class="mb-2 mt-2" />
              </v-card>
              <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2">
                <app-paginate :total="pages" @newPage="setPage" :new-page="page" :has-input="false" :has-last="false" />
              </v-layout>
            </v-flex> -->
        <v-flex xs12 v-if="loading">
          <div v-for="i in maxItems" :key=i>
            <token-table-row-loading/>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
  import AppError from '@app/core/components/ui/AppError2.vue'
  import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
  import TokenTableRowLoading from '@app/modules/tokens/components/TokenTableRowLoading.vue'
  import {
    PendingTx,
    Tx,
    SimpleTx
  } from '@app/core/models'
  import {
    Vue,
    Component,
    Prop,
    Watch
  } from 'vue-property-decorator'

  @Component({
    components: {
      AppError,
      AppPaginate,
      TokenTableRowLoading
    }
  })
  export default class TableTxs extends Vue {
    // @Prop({ type: Boolean, default: true }) loading: boolean
    // @Prop(String) pageType: string
    // @Prop(String) showStyle!: string
    // @Prop(Array) transactions!: Tx[] | PendingTx[] | SimpleTx[]
    // @Prop({ type: Number, default: 0 }) totalTxs: number
    // @Prop(Number) maxItems!: number
    // @Prop(String) error: string

    loading = true
    hasError = false
    maxItems = 10
    totalTokens = 100

    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

    // @Watch('page')
    // onPageChanged(newVal: number, oldVal: number): void {
    //   this.$emit('getTxsPage', this.page)
    // }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    // setPage(value: number): void {
    //   this.page = value
    // }

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

    // get isSyncing() {
    //   return this.$store.getters.syncing
    // }
    // get hasError(): boolean {
    //   return this.error !== ''
    // }


    get pages(): number {
      return this.totalTokens ? Math.ceil(this.totalTokens / this.maxItems) : 0
    }
  }
</script>
