<template>
  <v-card color="white" flat v-if="contracts" class="pt-3 pr-2 pl-2 pb-0">
    <!--
    =====================================================================================
      !hasError
    =====================================================================================
    -->
    <div v-if="!hasError">
      <v-layout justify-space-between align-center row wrap class="pr-2 pl-2">
        <v-flex v-if="loading" xs12>
          <v-progress-linear color="blue" indeterminate />
        </v-flex>
        <v-flex xs12 sm6>
          <p class="info--text mb-0 pl-2">
            {{ $t('contract.total') }}:
            <span v-if="!loading" class="black--text">{{ totalContracts }}</span>
            <span v-else class="table-row-loading" />
            {{ contractString }}
          </p>
        </v-flex>
        <v-flex v-if="!loading && totalPages > 1" xs12 sm6>
          <app-paginate :total="totalPages" :current-page="page" @newPage="setPage" />
        </v-flex>
        <!--
        =====================================================================================
          TABLE HEADER
        =====================================================================================
        -->
        <v-flex xs12 hidden-xs-only>
          <v-card color="info" flat class="white--text pl-3 pr-1 mb-1" height="40px">
            <v-layout align-center justify-start row fill-height pr-3>
              <v-flex sm4>
                <h5>{{ $t('contract.hash') }}</h5>
              </v-flex>
              <v-flex sm4>
                <h5>{{ $t('contract.created') }}</h5>
              </v-flex>
              <v-flex sm2>
                <h5>{{ $t('common.age') }}</h5>
              </v-flex>
              <v-flex sm2>
                <h5>{{ $t('tx.cost') }}</h5>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <!--
      =====================================================================================
        TABLE BODY
      =====================================================================================
      -->
      <div v-if="loading">
        <v-flex sm12 hidden-xs-only>
          <div v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
              <v-flex sm4>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex sm4>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex sm2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
              <v-flex sm2>
                <v-flex xs12 class="table-row-loading"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </v-flex>
        <v-flex xs12 hidden-sm-and-up>
          <div class="table-row-mobile ma-1" v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pa-2 ">
              <v-flex xs4>
                <div class="table-row-loading"></div>
              </v-flex>
              <v-flex xs12>
                <div class="table-row-loading"></div>
              </v-flex>
              <v-flex xs12>
                <div class="table-row-loading"></div>
              </v-flex>
              <v-flex xs4>
                <div class="table-row-loading"></div>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </div>
      <div v-else>
        <v-card v-if="contracts.length === 0" flat>
          <!--
          =====================================================================================
            Note: Once modularized, This case will not exhists,
                  since module won't load if address did not create any contract
          =====================================================================================
           -->
          <v-card-text class="text-xs-center secondary--text">No Contracts</v-card-text>
        </v-card>
        <div v-if="contracts.length > 0">
          <table-address-contracts-row v-for="(contract, index) in contracts" :key="index" :contract="contract" />
        </div>
        <v-layout v-if="totalPages > 1" justify-end row class="pb-1 pr-2 pl-2">
          <app-paginate :total="totalPages" :current-page="page" @newPage="setPage" />
        </v-layout>
      </div>
    </div>
    <!--
    =====================================================================================
      hasError
    =====================================================================================
    -->
    <app-error v-else :has-error="hasError" :message="error" />
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Contract } from '@app/core/models'
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

  @Prop(Array) contracts!: Contract[]
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

  get contractString(): string {
    return this.totalContracts > 1 ? this.$i18n.tc('contract.name', 2) : this.$i18n.tc('contract.name', 2)
  }

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

<style scoped lang="css">

.table-row-mobile {
  border: 1px solid #b4bfd2;
}
.table-row-loading {
  background: #e6e6e6;
  height: 12px;
  border-radius: 2px;
}
</style>
