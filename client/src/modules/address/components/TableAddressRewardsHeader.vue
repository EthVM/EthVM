<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout align-center justify-start row fill-height pl-3 pr-3>
        <v-flex v-if="!isGenesis" md4>
            <h5>{{ $t('block.number') }}</h5>
        </v-flex>
        <v-flex md4>
            <h5>{{ $t('common.age') }}</h5>
        </v-flex>
        <v-spacer v-if="isGenesis" />
        <v-flex md4>
            <h5>{{ $t('miner.reward-short') }}</h5>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TableAddressRewardsHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop({ type: Boolean, default: false }) isGenesis!: boolean
}
</script>
