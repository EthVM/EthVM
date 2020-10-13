<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout align-center justify-start row fill-height pr-4 pl-4>
        <v-flex md5>
            <h5 class="pl-4 ml-2">{{ $tc('address.name', 1) }}</h5>
        </v-flex>
        <v-flex md3>
            <h5>Name</h5>
        </v-flex>
        <v-flex md2>
            <h5>{{ $t('common.eth-balance') }}</h5>
        </v-flex>
        <v-flex md2>
            <h5>{{ $t('usd.value') }}</h5>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TableAddressTxsHeader extends Vue {}
</script>
