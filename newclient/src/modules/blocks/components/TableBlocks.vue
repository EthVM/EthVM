<template>
    <v-card color="white" flat class="pt-3 pb-2 mt-0">
        <!--
    =====================================================================================
      isLoading / ERROR
    =====================================================================================
    -->
        <v-progress-linear v-if="isLoading && !hasMessage" color="blue" indeterminate class="mt-0" />
        <!-- <app-error :has-error="hasMessage" :message="'error'" class="mb-4" /> -->
        <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
        <v-layout pl-2 pr-2>
            <v-flex hidden-xs-only sm12>
                <v-card v-if="!hasMessage" color="primary" flat class="white--text pl-3 table-blocks-header-card" height="40px">
                    <v-layout align-center justify-start row fill-height pr-3>
                        <v-flex sm2>
                            <h5>{{ $t('block.number') }}</h5>
                        </v-flex>
                        <v-spacer />
                        <v-flex sm2>
                            <h5>{{ $tc('tx.name', 2) }}</h5>
                        </v-flex>
                        <v-flex sm2>
                            <h5>{{ $t('miner.reward-short') }}</h5>
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
        <v-container v-if="!hasMessage" :style="getStyle" flat class="scroll-y pa-2">
            <v-layout column class="mb-1">
                <v-flex v-if="!isLoading">
                    <div v-for="(block, index) in displayData" :key="index">
                        <table-blocks-row :block="block" :page-type="pageType" />
                    </div>
                </v-flex>
                <div v-if="isLoading" xs12>
                    <div v-for="i in maxItems" :key="i">
                        <table-blocks-row-loading />
                    </div>
                </div>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import TableBlocksRow from '@app/modules/blocks/components/TableBlocksRow.vue'
import TableBlocksRowLoading from '@app/modules/blocks/components/TableBlocksRowLoading.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
const SCROLLVIEW = 'max-height: 450px'

@Component({
    components: {
        AppFootnotes,

        TableBlocksRow,
        TableBlocksRowLoading
    }
})
export default class TableBlocks extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Array) blockData!: any[]
    @Prop(Boolean) isLoading!: boolean
    @Prop(Number) maxItems!: number
    @Prop(Number) index!: number
    @Prop({ type: String, default: '' }) tableMessage!: string
    @Prop({ type: Boolean, default: false }) isScrollView!: boolean
    @Prop({ type: String, default: 'home' }) pageType!: string

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get hasMessage(): boolean {
        return this.tableMessage != ''
    }

    get getStyle(): string {
        return this.isScrollView ? SCROLLVIEW : ''
    }

    get displayData(): any[] {
        if (this.blockData) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.blockData.length ? this.blockData.length : start + this.maxItems
            return this.blockData.slice(start, end)
        }
        return []
    }
}
</script>

<style scoped lang="css">
.title-live {
    min-height: 60px;
}
.table-blocks-header-card {
    margin-right: 1px;
}
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
