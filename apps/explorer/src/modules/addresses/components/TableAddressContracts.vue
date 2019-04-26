<template>
  <v-card color="white" flat v-if="contracts" class="pt-3 pr-2 pl-2 pb-0">
    <!--
    =====================================================================================
      LOADING / ERROR
    =====================================================================================
    -->
    <v-progress-linear color="blue" v-if="loading" indeterminate class="mt-0" />
    <div v-else style="height: 7px; margin-bottom: 1em"></div>
    <app-error :has-error="hasError" :message="error" />
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout v-if="totalContracts > 0" justify-end row class="pb-1 pr-2 pl-2">
      <app-paginate :total="totalPages" :current-page="page" @newPage="setPage" />
    </v-layout>
    <v-card color="primary" flat class="white--text pl-3 pr-1 mb-1" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex sm3>
          <h5>{{ $t('contract.hash') }}</h5>
        </v-flex>
        <v-flex sm4>
          <h5>{{ $tc('tx.hash', 1) }}</h5>
        </v-flex>
        <v-flex sm1>
          <h5>{{ $t('block.number') }}</h5>
        </v-flex>
        <v-flex sm2>
          <h5>{{ $t('tx.fee', 1) }}</h5>
        </v-flex>
        <v-flex sm2>
          <h5>{{ $t('common.age') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!--
    =====================================================================================
      TABLE BODY
    =====================================================================================
    -->
    <div v-if="loading">
      <v-flex xs12>
        <div v-for="i in maxItems" :key="i">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
            <v-flex xs6 sm2>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
            <v-flex hidden-xs-only sm4 md3>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
            <v-flex xs6 sm3 md4>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
            <v-flex idden-xs-only sm3>
              <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
            </v-flex>
          </v-layout>
          <v-divider class="mb-2 mt-2" />
        </div>
      </v-flex>
    </div>
    <div v-else>
      <v-card v-if="totalContracts === 0" flat>
        <v-card-text class="text-xs-center secondary--text">{{ $t('token.empty') }}</v-card-text>
      </v-card>
      <div v-if="contracts.length > 0" v-for="(contract, index) in contracts" :key="index">
        <table-address-contracts-row :contract="contract" />
      </div>
      <v-layout v-if="totalContracts > 0" justify-end row class="pb-1 pr-2 pl-2">
        <app-paginate :total="totalPages" :current-page="page" @newPage="setPage" />
      </v-layout>
    </div>
  </v-card>
</template>

<script lang="ts">
  import AppError from '@app/core/components/ui/AppError.vue'
  import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
  import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { Contract } from "@app/core/models"
  import TableAddressContractsRow from '@app/modules/addresses/components/TableAddressContractsRow.vue'

  const MAX_ITEMS = 10

@Component({
  components: {
    AppError,
    AppInfoLoad,
    AppPaginate,
    TableAddressContractsRow
  }
})
export default class TableAddressContracts extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Array) contracts!: Contract[];
  @Prop({ type: Boolean, default: true }) loading!: boolean
  @Prop(String) error!: string
  @Prop(Number) totalContracts: number = 0
  @Prop(Number) page: number = 0

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Upon page update from AppPagination, set page equal to pagination page.
   */
  setPage(page: number): void {
    this.$emit('page', page)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * @return {Number} - MAX_ITEMS per pagination page
   */
  get maxItems(): number {
    return MAX_ITEMS
  }

  /**
   * @return {Number} - Total number of pagination pages
   */
  get totalPages(): number {
    return this.totalContracts > 0 ? Math.ceil(this.totalContracts / this.maxItems) : 0
  }

  /**
   * If the error string is empty, there is no error.
   *
   * @return {Boolean} - Whether or not there is an error.
   */
  get hasError(): boolean {
    return this.error !== ''
  }

}
</script>
