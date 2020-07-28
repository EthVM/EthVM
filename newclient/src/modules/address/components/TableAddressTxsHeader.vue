<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout align-center justify-start row fill-height>
        <v-flex md5>
            <h5 class="pl-3">{{ $tc('tx.hash', 1) }}</h5>
        </v-flex>
        <v-flex md3 lg2>
            <h5>{{ $t('common.amount') }}</h5>
        </v-flex>
        <v-flex sm2 hidden-md-and-down>
            <h5 class="hidden-md-and-down">{{ feeString }}</h5>
        </v-flex>
        <v-flex md3 lg2>
            <h5>{{ $t('common.age') }}</h5>
        </v-flex>
        <v-spacer />
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TableAddressTxsHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop({ type: Boolean, default: false }) isPending!: boolean

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get feeString(): string {
        return this.isPending ? `${this.$t('tx.estimated-fee')}` : `${this.$tc('tx.fee', 1)}`
    }
}
</script>
