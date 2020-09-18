<template>
    <v-card color="white" flat class="pt-3 mt-0">
        <!--
    =====================================================================================
      isLoading / ERROR
    =====================================================================================
    -->
        <!-- <app-error :has-error="hasMessage" :message="'error'" class="mb-4" /> -->
        <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
        <v-layout pl-2 pr-2>
            <v-flex hidden-sm-and-down sm12>
                <v-card v-if="!hasMessage" color="info" flat class="white--text pl-3 table-blocks-header-card" height="40px">
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
        <v-container v-if="!hasMessage" :style="getStyle" flat class="scroll-y pt-2 pr-2 pl-2 pb-0">
            <v-layout column class="mb-1">
                <v-flex v-if="!isLoading">
                    <div v-for="(block, index) in blockData" :key="index">
                        <table-blocks-row :block="block" :page-type="pageType" />
                    </div>
                </v-flex>
                <div v-if="isLoading" xs12>
                    <div v-for="i in maxItems" :key="i">
                        <app-table-row-loading />
                    </div>
                </div>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import TableBlocksRow from '@app/modules/blocks/components/TableBlocksRow.vue'
import AppTableRowLoading from '@app/core/components/ui/AppTableRowLoading.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
const SCROLLVIEW = 'max-height: 450px'

@Component({
    components: {
        AppFootnotes,
        TableBlocksRow,
        AppTableRowLoading
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
