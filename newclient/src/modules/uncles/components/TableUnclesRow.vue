<template>
    <div>
        <v-layout
            :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'table-row-mobile mb-2' : 'pl-3 pr-2 pt-2 pb-1']"
            grid-list-xs
            row
            wrap
            align-center
            justify-space-between
            fill-height
        >
            <v-flex xs4 sm2 order-xs1>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs4 sm2 order-xs1>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs12 sm5 md5 order-xs3 order-sm2>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs8 hidden-sm-only md1 order-xs4 order-sm3>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex d-flex xs12 sm3 md2 order-xs2 order-md4>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TableUnclesRowLoading extends Vue {}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
