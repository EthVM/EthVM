<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 mt-0">
    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->
    <v-layout align-end justify-space-between row wrap fill-height pb-1>
      <v-flex xs12 sm6>
        <v-card-title class="title font-weight-bold pb-1">{{ $t('title.uncles') }}</v-card-title>
      </v-flex>
      <v-flex xs12 sm6 v-if="pages > 1">
        <v-layout justify-end class="pb-1 pr-2 pl-2">
          <app-paginate :total="pages" @newPage="setPage" :current-page="page" :has-input="false" :has-first="false" :has-last="false" />
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
    <v-card v-if="!hasError" color="info" flat class="white--text pl-3 pr-1" height="40px" style="margin-right: 1px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm2 md2>
          <h5>{{ $t('tableHeader.blockHeight') }}</h5>
        </v-flex>
        <v-flex xs6 sm2 md2>
          <h5>{{ $t('title.uncleNumber') }}</h5>
        </v-flex>
        <v-flex sm5 md5 hidden-sm-and-down>
          <h5>{{ $t('title.uncleDetail') }}</h5>
        </v-flex>
        <v-spacer />
        <v-flex hidden-sm-and-down md1>
          <h5>{{ $t('title.position') }}</h5>
        </v-flex>
        <v-flex xs6 sm3 md2>
          <h5>{{ $t('tableHeader.reward') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!--
    =====================================================================================
      TABLE BODY
    =====================================================================================
    -->
    <v-card flat id="scroll-target" :style="style" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target style="margin-right: 1px" class="mb-1">
        <v-flex xs12 v-if="!loading">
          <v-card v-for="uncle in uncles" class="transparent" flat :key="uncle.getHash()">
            <table-uncles-row :uncle="uncle" :page-type="pageType" />
            <v-divider class="mb-2 mt-2" />
          </v-card>
        </v-flex>
        <v-flex xs12 v-if="loading">
          <div v-for="i in maxItems" :key="i">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
              <v-flex xs3 sm2 order-xs1>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex xs3 sm2 order-xs1>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex xs12 sm5 md5 class="pr-0" order-xs3 order-sm2>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex hidden-sm-and-down md1 order-xs4 order-sm3>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
              <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
                <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
              </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
          </div>
        </v-flex>
        <v-flex xs12>
          <v-layout justify-end v-if="pages > 1" class="pr-2 pl-2">
            <app-paginate :total="pages" @newPage="setPage" :current-page="page" :has-input="false" :has-first="false" :has-last="false" />
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppPaginateTwo from '@app/core/components/ui/AppPaginate.vue'
import TableUnclesRow from '@app/modules/uncles/components/TableUnclesRow.vue'
import { Uncle } from '@app/core/models'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  components: {
    AppError,
    AppInfoLoad,
    AppPaginate,
    AppPaginateTwo,
    TableUnclesRow
  }
})
export default class TableUncles extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String, default: '' }) showStyle!: string
  @Prop({ type: Array, default: [] }) uncles!: Uncle[]
  @Prop({ type: Boolean, default: true }) loading: boolean
  // @Prop({ type: Boolean, default: false }) error: boolean
  @Prop({ type: Number, default: 0 }) totalUncles!: number
  @Prop({ type: Number, default: 0 }) page: number // Page passed from parent view. Syncs pagination components
  @Prop(Number) maxItems!: number
  @Prop(String) error: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  pageType = 'uncles'

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setPage(page: number): void {
    this.$emit('getUnclePage', page)
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

  get style(): string {
    return this.showStyle
  }

  get pages(): number {
    return this.totalUncles ? Math.ceil(this.totalUncles / this.maxItems) : 0
  }
}
</script>
