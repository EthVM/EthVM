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
          <v-card-title class="info--text">(Total: {{ totalTokens }} {{ $t('title.tokens') }})</v-card-title>
        </v-layout>
      </v-flex>
      <v-spacer />
      <v-flex hidden-xs-only v-if="pages > 1 && !hasError" sm7 md6>
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
            <v-flex hidden-xs-only sm4 pl-2>
              <h5 class="pl-5">{{ $t('token.name') }}</h5>
            </v-flex>
            <v-flex hidden-xs-only sm2>
              <v-layout align-center justify-start row pl-1>
                <h5 class="pr-2">{{ $t('token.price') }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectFilter(0)">
                      <v-icon :class="[isActive(0)? 'white--text':'bttnToken--text']" small>fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectFilter(1)">
                      <v-icon :class="[isActive(1)? 'white--text':'bttnToken--text']" small>fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex hidden-xs-only sm2 pl-0>
                <h5>{{ $t('token.change') }}</h5>
            </v-flex>
            <v-flex hidden-xs-only sm2>

              <v-layout align-center justify-start row pl-2>
                <h5 class="pr-1">{{ $t('token.volume') }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectFilter(2)">
                      <v-icon :class="[isActive(2)? 'white--text':'bttnToken--text']" small>fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectFilter(3)">
                      <v-icon :class="[isActive(3)? 'white--text':'bttnToken--text']" small>fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex hidden-xs-only sm2>
              <v-layout align-center justify-start row pl-2>
                <h5 class="pr-1">{{ $t('token.cap') }}</h5>
                <v-flex>
                  <v-layout align-start justify-center column>
                    <v-btn flat icon @click="selectFilter(4)">
                      <v-icon :class="[isActive(4)? 'white--text':'bttnToken--text']" small>fas fa-caret-up</v-icon>
                    </v-btn>
                    <v-btn flat icon @click="selectFilter(5)">
                      <v-icon :class="[isActive(5)? 'white--text':'bttnToken--text']" small>fas fa-caret-down</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex hidden-sm-and-up xs12 mr-1 ml-1>
        <token-filter />
      </v-flex>
    </v-layout>
    <!--
        =====================================================================================
          TABLE BODY
        =====================================================================================
        -->

    <v-card flat v-if="!hasError">
      <v-layout column fill-height class="mb-1">
        <v-flex xs12 v-if="!loading">
          <div v-for="token in tokens" class="transparent" flat :key="token._id">
            <token-table-row :token="token" />
          </div>
          <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2">
            <app-paginate :total="pages" @newPage="setPage" :new-page="page" />
          </v-layout>
        </v-flex>
        <v-flex xs12 v-else>
          <div v-for="i in maxItems" :key="i">
            <token-table-row-loading />
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
  import AppError from '@app/core/components/ui/AppError.vue'
  import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
  import TokenFilter from '@app/modules/tokens/components/TokenFilter.vue'
  import TokenTableRowLoading from '@app/modules/tokens/components/TokenTableRowLoading.vue'
  import TokenTableRow from '@app/modules/tokens/components/TokenTableRow.vue'
  import {
    TokenExchange
  } from '@app/modules/tokens/props'

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
    @Prop({
      type: Boolean,
      default: true
    }) loading: boolean
    @Prop(Array) tokens!: TokenExchange[]
    @Prop({
      type: Number,
      default: 0
    }) totalTokens: number
    @Prop(String) error: string

    maxItems = 10
    page = 1
    selectedFilter = 0
    filter = [{
        _id: 0,
        category: 'price',
        filter: 'high'
      },
      {
        _id: 1,
        category: 'price',
        filter: 'low'
      },
      {
        _id: 2,
        category: 'volume',
        filter: 'high'
      },
      {
        _id: 3,
        category: 'volume',
        filter: 'low'
      },
      {
        _id: 4,
        category: 'cap',
        filter: 'high'
      },
      {
        _id: 5,
        category: 'cap',
        filter: 'low'
      }
    ]
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

    setPage(value: number): void {
      this.page = value
    }

    selectFilter(_value: number): void {
      this.selectedFilter = _value
    }
    isActive(_value: number): boolean {
      return this.selectedFilter === _value
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

    get pages(): number {
      return this.totalTokens ? Math.ceil(this.totalTokens / this.maxItems) : 0
    }

  }
</script>

<style scoped lang="css">
  .v-btn.v-btn--flat.v-btn--icon {
    height: 12px;
    width: 12px;
    margin: 0;
  }
</style>

