<template>
    <div>
        <div :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'table-row-mobile ma-2' : '']">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-4 pt-2">
                <v-flex xs12>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                </v-flex>
                <v-flex v-if="$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs'" xs12 pt-0>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="mr-2 ml-2 mb-2 mt-0" />
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
export default class AppTableRowLoading extends Vue {}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
