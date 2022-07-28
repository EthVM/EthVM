<template>
    <v-btn icon color="textPrimary" variant="text" size="x-small" @click.stop="btnClick()">
        <v-icon v-bind="$attrs"></v-icon>
        <v-tooltip v-if="tooltipText !== ''" activator="parent" location="top">
            {{ props.tooltipText }}
        </v-tooltip>
    </v-btn>
</template>

<script setup lang="ts">
/**
 * PLESE USE FALLTHROUGH vue attrs from button icon:
 * pass `icon` prop of material design, ei: icon="content_copy"
 * you can also pass `color`, to change icon color
 */
const props = defineProps({
    tooltipText: {
        type: String,
        default: ''
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

<style lang="scss" scoped></style>
