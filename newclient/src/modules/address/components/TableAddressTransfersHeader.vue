<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout align-center justify-start row fill-height>
        <v-flex md3>
            <h5 class="pl-3">{{ this.$tc('token.name', 1) }}</h5>
        </v-flex>
        <v-spacer />
        <v-flex md3>
            <h5>{{ text }}</h5>
        </v-flex>
        <v-flex md2>
            <h5>{{ $t('common.age') }}</h5>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TableAddressTransfersHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
   */
    @Prop(Boolean) isErc20!: boolean

    /*
    ===================================================================================
      Computed
    ===================================================================================
   */

    get text(): string {
        return this.isErc20 ? `${this.$t('common.amount')}` : 'Token ID'
    }
}
</script>
