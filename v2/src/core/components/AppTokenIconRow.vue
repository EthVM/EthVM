<template>
    <v-row class="flex-nowrap fill-height justify-start justify-sm-end ma-0" align="center">
        <div v-for="(i, index) in props.tokens" :key="index" :class="['d-flex align-center', { 'ml-n5': index != 0 }]">
            <app-token-icon :tokenIcon="i" img-size="40"></app-token-icon>
        </div>
    </v-row>
</template>

<script setup lang="ts">
import AppTokenIcon from './AppTokenIcon.vue'

interface PropsInterface {
    tokens: string[]
}

const props = defineProps<PropsInterface>()
</script>

<style lang="scss"></style>
