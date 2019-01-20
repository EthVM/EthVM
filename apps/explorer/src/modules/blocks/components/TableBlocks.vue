<template>
  <v-card color="white" flat class="pt-3 pr-4 pl-4 mt-0">
    <v-layout v-if="pageType != 'home'" row wrap align-center pb-1>
      <v-flex d-flex xs12 sm8 order-xs1>
        <v-card-title class="title font-weight-bold">{{ getTitle }}</v-card-title>
      </v-flex>
      <v-flex hidden-sm-and-down md4 order-xs2>
        <v-layout justify-end> <app-footnotes :footnotes="footnotes" /> </v-layout>
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
    <app-error-no-data v-if="error" />
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
    </div>
  </v-card>
</template>

<script lang="ts">
import AppErrorNoData from '@app/core/components/ui/AppErrorNoData.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import TableBlocksRow from '@app/modules/blocks/components/TableBlocksRow.vue'
import { Block } from '@app/core/models'
import { Footnote } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppErrorNoData,
    AppFootnotes,
    AppInfoLoad,
    TableBlocksRow
  }
})
export default class TableBlocks extends Vue {
  @Prop({ type: Boolean, default: true }) loading: boolean
  @Prop({ type: Boolean, default: false }) error: boolean

  @Prop({ type: String, default: 'blocks' }) pageType!: string
  @Prop({ type: String, default: '' }) showStyle!: string
  @Prop(Array) blocks!: Block[]

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
}
</script>
