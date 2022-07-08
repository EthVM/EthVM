<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{ on }">
            <v-btn :small="isSmall" icon fab class="ma-0" @click.stop="btnClick()" v-on="on">
                <v-icon :small="isSmall" :class="iconColor"> {{ icon }}</v-icon>
            </v-btn>
        </template>
        <span class="black--text">{{ tooltipText }}</span>
    </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
    tooltipText: String,
    icon: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    isSmall: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['click'])

/*
===================================================================================
    Computed
===================================================================================
*/

const iconColor = computed<string>(() => {
    return props.color === '' ? 'primary--text' : `${props.color}--text`
})

const btnClick = (): void => {
    emit('click')
}
</script>

<style lang="scss" scoped>
.v-btn--floating.v-btn--small {
    height: 30px;
    width: 30px;
}
</style>
