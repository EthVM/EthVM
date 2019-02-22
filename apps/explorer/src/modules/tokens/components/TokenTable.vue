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
          <v-card-title class="info--text">(Total: {{totalTokens}} {{ $t('title.tokens') }})</v-card-title>
        </v-layout>
      </v-flex>
      <v-spacer />
      <v-flex v-if="pages > 1 && !hasError" xs12 sm7 md6>
        <!-- <v-layout justify-end row class="pb-1 pr-2 pl-2">
          <app-paginate :total="pages" @newPage="setPage" :new-page="page" />
        </v-layout> -->
      </v-flex>
    </v-layout>
    <!--
      =====================================================================================
        LOADING / ERROR
      =====================================================================================
      -->
    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <!-- <app-error v-if="hasError" :has-error="hasError" :message="error" class="mb-4" /> -->
    <!--
      =====================================================================================
        TABLE HEADER
      =====================================================================================
      -->
      <v-layout>
        <v-flex hidden-xs-only sm12>
    <v-card v-if="!hasError" color="info" flat class="white--text pl-4 pr-1" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex hidden-xs-only sm4 pl-4 ml-2>
          <h5 class="pl-4">{{ $t('token.name') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm2>
          <h5>{{ $t('token.price') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm2 pl-0>
          <h5>{{ $t('token.change') }}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm2>
          <h5>{{ $t('token.volume')}}</h5>
        </v-flex>
        <v-flex hidden-xs-only sm2>
          <h5>{{ $t('token.cap') }}</h5>
        </v-flex>

      </v-layout>
    </v-card>
        </v-flex>
        <v-flex hidden-sm-and-up xs12 mr-1 ml-1>
          <token-filter/>
        </v-flex>
      </v-layout>
    <!--
      =====================================================================================
        TABLE BODY
      =====================================================================================
      -->

    <v-card flat v-if="!hasError" id="scroll-target" class="scroll-y" style="overflow-x: hidden">
      <v-layout column fill-height class="mb-1" v-scroll:#scroll-target>
        <v-flex xs12 v-if="!loading">
              <div v-for="token in tokens" class="transparent" flat :key="token._id">
                <token-table-row :token="token"/>
              </div>
              <!-- <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2">
                <app-paginate :total="pages" @newPage="setPage" :new-page="page" :has-input="false" :has-last="false" />
              </v-layout> -->
        </v-flex>
        <v-flex xs12 v-else>
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
  import TokenFilter from '@app/modules/tokens/components/TokenFilter.vue'
  import TokenTableRowLoading from '@app/modules/tokens/components/TokenTableRowLoading.vue'
  import TokenTableRow from '@app/modules/tokens/components/TokenTableRow.vue'
  import { TokenExchange} from '@app/modules/tokens/props'

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
      TokenFilter,
      TokenTableRow,
      TokenTableRowLoading
    }
  })
  export default class TokenTable extends Vue {
    @Prop({ type: Boolean, default: true }) loading: boolean
    // @Prop(Array) transactions!: Tx[] | PendingTx[] | SimpleTx[]
    // @Prop({ type: Number, default: 0 }) totalTxs: number
    // @Prop(Number) maxItems!: number
    // @Prop(String) error: string
    @Prop(Array)tokens!: TokenExchange[]
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


