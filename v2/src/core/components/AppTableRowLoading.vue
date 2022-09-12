<template>
    <div>
        <div :class="[sm || xs ? 'table-row-mobile ma-2' : '']">
            <v-row align="center" justify="start" fill-height class="pl-2 pr-4 pt-2">
                <v-col>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                    <v-progress-linear v-if="sm || xs" xs12 color="lineGrey" value="40" indeterminate height="15" class="mr-2 ml-2 mb-2 mt-0" />
                </v-col>
            </v-row>
            <v-divider class="mb-2 mt-2 hidden-sm-and-down" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs, sm } = useDisplay()
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
