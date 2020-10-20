<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout grid-list-xs align-center justify-start row fill-height pr-2 pl-2>
        <v-flex v-if="deleteMode" md1>
            <v-layout row align-center justify-start pl-2>
                <app-check-box :values-array="deleteArray" :is-select-all="true" :is-white="true" :all-selected="allSelected" @selectAll="selectAll" />
                <p class="select-all">{{ $t('fav.select-all') }}</p>
            </v-layout>
        </v-flex>
        <v-flex md4>
            <h5 class="pl-4 ml-4">{{ $tc('address.name', 1) }}</h5>
        </v-flex>
        <v-flex md3 pl-3>
            <h5>{{ $t('fav.name') }}</h5>
        </v-flex>
        <v-flex md2 pl-3>
            <h5>{{ $t('common.eth-balance') }}</h5>
        </v-flex>
        <v-flex md2 pl-3>
            <h5>{{ $t('usd.value') }}</h5>
        </v-flex>
        <v-spacer v-if="deleteMode" />
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppCheckBox from '@app/core/components/ui/AppCheckBox.vue'

@Component({
    components: {
        AppCheckBox
    }
})
export default class TableAddressTxsHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop({ type: Boolean, default: false }) allSelected!: boolean
    @Prop(Array) deleteArray!: string[]
    @Prop(Boolean) deleteMode!: boolean

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    selectAll(): void {
        this.$emit('selectAllInHeader')
    }
}
</script>
<style scoped lang="css">
.select-all {
    font-size: 80%;
    white-space: nowrap;
}
</style>
