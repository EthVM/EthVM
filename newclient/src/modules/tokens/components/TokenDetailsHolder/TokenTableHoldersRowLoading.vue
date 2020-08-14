<template>
    <div>
        <v-layout
            :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'table-row-mobile ma-2' : 'pl-3 pr-3 pt-2']"
            grid-list-xs
            row
            wrap
            align-center
            justify-start
            fill-height
        >
            <v-flex xs12 sm6>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs10 sm3 md4>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs8 sm3 md2>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2 hidden-sm-and-down" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TokenTableHoldersRowLoading extends Vue {}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
