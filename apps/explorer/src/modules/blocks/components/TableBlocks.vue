<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 mt-0">
    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->
    <v-layout v-if="pageType != 'home'" align-end justify-space-between row wrap fill-height pb-1>
      <v-flex xs12 sm5 md4 class="title-live" pb-0>
        <v-layout align-end justify-start row fill-height>
          <v-card-title class="title font-weight-bold ">{{ getTitle }}</v-card-title>
          <v-flex v-if="pageType == 'blocks' && !loading">
            <app-live-update @refreshTable="updateTable" :page-type="pageType" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-spacer />
      <v-flex hidden-sm-and-down md3>
        <v-layout justify-end pb-1> <app-footnotes :footnotes="footnotes" /> </v-layout>
      </v-flex>
      <v-flex xs12 sm7 md5 v-if="pages > 1 && !hasError">
        <v-layout justify-end row class="pb-2 pr-2 pl-2">
          <app-paginate
            :total="pages"
            @newPage="setPage"
            :current-page="page"
            :has-input="!simplePagination"
            :has-first="!simplePagination"
            :has-last="!simplePagination"
          />
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap align-center pb-1>
      <v-flex d-flex xs8 md7 order-xs1>
        <v-card-title class="title font-weight-bold">{{ $t('title.lastBlock') }}</v-card-title>
      </v-flex>
      <v-flex hidden-sm-and-down md4 order-md2>
        <v-layout justify-center> <app-footnotes :footnotes="footnotes" /> </v-layout>
      </v-flex>
      <v-flex d-flex xs4 md1 order-xs2 order-md3>
        <v-layout justify-end>
          <v-btn outline color="secondary" class="text-capitalize" to="/blocks">{{ $t('bttn.viewAll') }}</v-btn>
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
        <v-flex xs6 sm2 md3 lg2>
          <h5>{{ $t('tableHeader.blockN') }}</h5>
        </v-flex>
        <v-spacer />
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('tableHeader.txs') }}</h5>
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
    <v-card v-if="!hasError" flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target style="margin-right: 1px" class="mb-1">
        <v-flex xs12 v-if="!loading">
          <v-card v-for="block in blocks" class="transparent" flat :key="block.getHash()">
            <table-blocks-row :block="block" :page-type="pageType" />
            <v-divider class="mb-2 mt-2" />
          </v-card>
          <v-layout v-if="pageType != 'home' && pages > 1" justify-end row class="pb-1 pr-2 pl-2">
            <app-paginate
              :total="pages"
              @newPage="setPage"
              :current-page="page"
              :has-input="!simplePagination"
              :has-first="!simplePagination"
              :has-last="!simplePagination"
            />
          </v-layout>
        </v-flex>
        <v-flex xs12 v-if="loading">
          <div v-for="i in maxItems" :key="i">
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
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppLiveUpdate from '@app/core/components/ui/AppLiveUpdate.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableBlocksRow from '@app/modules/blocks/components/TableBlocksRow.vue'
import { Block, SimpleBlock } from '@app/core/models'
import { Footnote } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppInfoLoad,
    AppLiveUpdate,
    AppPaginate,
    TableBlocksRow
  }
})
export default class TableBlocks extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: Boolean, default: true }) loading!: boolean
  @Prop({ type: String, default: 'blocks' }) pageType!: string
  @Prop({ type: String, default: '' }) showStyle!: string
  @Prop(Array) blocks!: Block[] | SimpleBlock[]
  @Prop({ type: Number, default: 0 }) totalBlocks!: number
  @Prop({ type: Number, default: 20 }) maxItems!: number
  @Prop({ type: Boolean, default: false }) simplePagination!: boolean
  @Prop({ type: Number, default: 0 }) page!: number
  @Prop(String) error!: string

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setPage(page: number): void {
    this.$emit('getBlockPage', page)
  }

  updateTable(): void {
    this.$emit('updateTable')
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

  get getStyle(): string {
    return this.showStyle
  }

  get getTitle(): string {
    const titles = {
      blocks: this.$i18n.t('title.blocks'),
      address: this.$i18n.t('title.minedBlocks')
    }
    return titles[this.pageType]
  }

  get footnotes(): Footnote[] {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('footnote.success').toString(),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('footnote.failed').toString(),
        icon: 'fa fa-circle'
      }
    ]
  }

  get pages(): number {
    return this.totalBlocks ? Math.ceil(this.totalBlocks / this.maxItems) : 0
  }
}
</script>

<style scoped lang="css">
.title-live{
  min-height:60px;
}
</style>
