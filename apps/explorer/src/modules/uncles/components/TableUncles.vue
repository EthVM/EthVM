<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 mt-0">
    <v-layout align-end justify-space-between row wrap fill-height pb-1>
      <v-flex xs12 sm6>
        <v-card-title class="title font-weight-bold pb-1">{{ $t('title.uncles') }}</v-card-title>
      </v-flex>
      <v-flex xs12 sm6 v-if="pages > 1">
        <v-layout justify-end class="pb-1 pr-2 pl-2"><app-paginate :total="pages" @newPage="setPage" :new-page="page" /> </v-layout>
      </v-flex>
    </v-layout>

    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1" height="40px" style="margin-right: 1px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm2 md3 lg2>
          <h5>{{ $t('tableHeader.blockHeight') }}</h5>
        </v-flex>
        <v-spacer />
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t('title.position') }}</h5>
        </v-flex>
        <v-flex xs6 sm3 md2>
          <h5>{{ $t('tableHeader.reward') }}</h5>
        </v-flex>
      </v-layout>
    </v-card>
    <!-- End Table Header -->

    <div v-if="!error">
      <app-info-load v-if="loading" />
      <v-card v-else flat id="scroll-target" :style="style" class="scroll-y pt-0 pb-0">
        <v-layout column fill-height v-scroll:#scroll-target style="margin-right: 1px" class="mb-1">
          <v-flex xs12>
            <transition-group name="list" tag="p">
              <v-card v-for="uncle in uncles" class="transparent" flat :key="uncle.getHash()">
                <table-uncles-row :uncle="uncle" :page-type="pageType" />
                <v-divider class="mb-2 mt-2" />
              </v-card>
            </transition-group>
          </v-flex>
        </v-layout>
      </v-card>
      <v-layout justify-end v-if="pages > 1" class="pr-2 pl-2"><app-paginate :total="pages" @newPage="setPage" :new-page="page" /> </v-layout>
    </div>
    <app-error v-else :server-error="error" />
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableUnclesRow from '@app/modules/uncles/components/TableUnclesRow.vue'
import { Uncle } from '@app/core/models'
import { Footnote } from '@app/core/components/props'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppInfoLoad,
    AppPaginate,
    TableUnclesRow
  }
})
export default class TableUncles extends Vue {
  @Prop({ type: String, default: '' }) showStyle!: string
  @Prop({ type: Array, default: [] }) uncles!: Uncle[]
  @Prop({ type: Boolean, default: true }) loading: boolean
  @Prop({ type: Boolean, default: false }) error: boolean
  @Prop({ type: Number, default: 0 }) totalUncles!: number
  @Prop(Number) maxItems!: number

  pageType = 'uncles'
  page = 1

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('getUnclePage', newVal - 1)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setPage(_value: number): void {
    this.page = _value
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get style(): string {
    return this.showStyle
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
    return this.totalUncles ? Math.ceil(this.totalUncles / this.maxItems) : 0
  }
}
</script>
