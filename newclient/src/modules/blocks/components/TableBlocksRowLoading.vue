<template>
    <div>
        <div :class="[$vuetify.breakpoint.name === 'xs' ? 'table-row-mobile ma-2' : '']">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-4 pr-4 pt-2">
                <v-flex xs4 sm2>
                    <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-spacer class="hidden-sm-and-up" />
                <v-flex xs3 class="hidden-sm-and-up">
                    <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs12 sm7 xl6>
                    <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs12 sm2>
                    <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
                <v-flex xs4 sm1 xl2>
                    <v-flex xs12 class="table-row-loading"></v-flex>
                </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2 hidden-xs-only" />
        </div>
        <div></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TableBlocksRowLoading extends Vue {}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
