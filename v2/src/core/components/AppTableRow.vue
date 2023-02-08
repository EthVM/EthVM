<template>
    <v-card flat class="mx-n6 rounded-0 py-1 position-relative" v-bind="vCardAttrs">
        <v-row class="text-body-1 my-0 flex-row mx-4 mb-1 mb-sm-0" v-bind="vRowAttrs" :dense="xs">
            <slot />
            <v-expand-transition v-if="$slots.expandable">
                <slot name="expandable" />
            </v-expand-transition>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()

const attrs = useAttrs()

// To pass props to the v-row, use row-props-name
// Other non-row props automatically gets passed to the v-card
// <app-table-row row-align="center" /> ---- the v-row would have attribute align="center"
// <app-table-row @click="handleClick" /> ---- the v-card would have attribute click="handleClick"
const vRowAttrs = Object.keys(attrs)
    .filter(el => el.startsWith('row-'))
    .reduce((acc, key) => {
        const atrrKey = key.split('row-')[1]
        return { ...acc, [atrrKey]: attrs[key] }
    }, {})

const vCardAttrs = Object.keys(attrs)
    .filter(el => !el.startsWith('row-'))
    .reduce((acc, key) => {
        return { ...acc, [key]: attrs[key] }
    }, {})
</script>

<style lang="scss"></style>
