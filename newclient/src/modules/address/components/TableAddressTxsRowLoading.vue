<template>
    <div>
        <v-layout
            :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'table-row-mobile mb-2' : 'pa-2']"
            grid-list-xs
            row
            wrap
            align-center
            justify-space-between
            fill-height
        >
            <v-flex hidden-sm-and-down sm3 md1 pl-3>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs4 sm6 md6>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs4 sm2 md1>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs12 hidden-sm-only md2>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs12 hidden-sm-only md1>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs5 sm1>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TableTxsRowLoading extends Vue {}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
