<template>
    <v-btn icon :color="props.color" flat :size="props.size" @click.stop="btnClick()">
        <v-icon>{{ props.icon }}</v-icon>
        <v-tooltip v-if="tooltipText !== ''" activator="parent" location="top">
            {{ tooltipText }}
        </v-tooltip>
    </v-btn>
</template>

<script setup lang="ts">
const props = defineProps({
    tooltipText: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'question_mark'
    },
    color: {
        type: String,
        default: 'transparent'
    },
    size: {
        type: String,
        default: 'x-small'
    }
})

const emit = defineEmits(['click'])

/*
===================================================================================
    Computed
===================================================================================
*/

const btnClick = (): void => {
    emit('click')
}
</script>
