<template>
    <div>
        <div :class="[$vuetify.breakpoint.name === 'sm' ? 'table-row-mobile ma-2' : '']">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-4 pt-2">
                <v-flex xs4 sm2>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                </v-flex>
                <v-spacer class="hidden-md-and-up" />
                <v-flex xs3 class="hidden-md-and-up">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                </v-flex>
                <v-flex xs12 sm6>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                </v-flex>
                <v-flex xs12 sm2>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                </v-flex>
                <v-flex xs4 sm2>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2 hidden-sm-and-down" />
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
