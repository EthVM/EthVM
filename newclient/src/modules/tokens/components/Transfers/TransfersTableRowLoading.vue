<template>
    <div>
        <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
            <v-flex :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'pr-3' : 'pr-5']" xs7 sm6 md7>
                <v-layout hidden-xs-only row align-center justift-start pa-2>
                    <v-flex xs12 class="table-row-loading"></v-flex>
                </v-layout>
                <v-layout hidden-xs-only row align-center justify-space-around fill-height pa-2>
                    <v-flex xs6 class="table-row-loading mr-2"></v-flex>
                    <v-flex xs6 class="table-row-loading ml-2"></v-flex>
                </v-layout>
                <v-flex hidden-sm-and-up xs-12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs5 sm2>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs12 sm2>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex xs12 hidden-sm-and-up>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
            <v-flex v-if="isInternal" xs5 sm2 md1>
                <v-flex xs12 class="table-row-loading"></v-flex>
            </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2 hidden-xs-only" />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TransfersTableRowLoading extends Vue {
    @Prop(Boolean) isInternal?: boolean
}
</script>

<style scoped lang="css">
.table-row-loading {
    margin: 1px;
}
</style>
