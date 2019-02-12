<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 mt-0">
    <v-layout v-if="pageType != 'home'" align-end justify-space-between row wrap fill-height pb-1>
      <v-flex xs12 sm5 md3>
        <v-card-title class="title font-weight-bold pb-1">{{ getTitle }}</v-card-title>
      </v-flex>
      <v-spacer />
      <v-flex hidden-sm-and-down md3>
        <v-layout justify-end pb-1> <app-footnotes :footnotes="footnotes" /> </v-layout>
      </v-flex>
      <v-flex xs12 sm7 md6 v-if="pages > 1">
        <v-layout justify-end row class="pb-1 pr-2 pl-2">
          <app-paginate :total="pages" @newPage="setPage" :new-page="page" />
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
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1" height="40px" style="margin-right: 1px">
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
    <!-- End Table Header -->
    <app-error v-if="error" :server-error="error" />
    <div v-else>
      <app-info-load v-if="loading" />
      <v-card v-else flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
        <v-layout column fill-height v-scroll:#scroll-target style="margin-right: 1px" class="mb-1">
          <v-flex xs12>
            <transition-group name="list" tag="p">
              <v-card v-for="block in blocks" class="transparent" flat :key="block.getHash()">
                <table-blocks-row :block="block" :page-type="pageType" />
                <v-divider class="mb-2 mt-2" />
              </v-card>
            </transition-group>
          </v-flex>
        </v-layout>
      </v-card>
      <v-layout v-if="pageType != 'home' && pages > 1" justify-end row class="pb-1 pr-2 pl-2">
        <app-paginate :total="pages" @newPage="setPage" :new-page="page" />
      </v-layout>
    </div>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableBlocksRow from '@app/modules/blocks/components/TableBlocksRow.vue'
import { Block } from '@app/core/models'
import { Footnote } from '@app/core/components/props'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

const MAX_TXS = 10

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppInfoLoad,
    AppPaginate,
    TableBlocksRow
  }
})
export default class TableBlocks extends Vue {
  @Prop({ type: Boolean, default: true }) loading: boolean
  @Prop({ type: Boolean, default: false }) error: boolean
  @Prop({ type: String, default: 'blocks' }) pageType!: string
  @Prop({ type: String, default: '' }) showStyle!: string
  @Prop(Array) blocks!: Block[]
  @Prop({ type: Number, default: 0 }) totalBlocks!: number
  @Prop(Number) maxItems!: number
  page = 1

  /*Methods: */
  setPage(_value: number): void {
    this.page = _value
  }

  /* Watch: */
  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('getBlockPage', newVal - 1)
  }

  /* Computed: */
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

  get footnotes() {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('footnote.success'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('footnote.failed'),
        icon: 'fa fa-circle'
      }
    ]
  }
  get pages(): number {
    return this.totalBlocks ? Math.ceil(this.totalBlocks / this.maxItems) : 0
  }
}
</script>
