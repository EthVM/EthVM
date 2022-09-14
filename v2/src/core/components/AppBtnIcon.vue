<template>
    <v-btn icon color="textPrimary" variant="text" height="34px" width="34px" @click.stop="btnClick()">
        <v-icon v-bind="$attrs" :class="buttonFontSize"></v-icon>
        <v-tooltip v-if="tooltipText !== ''" activator="parent" location="top">
            {{ props.tooltipText }}
        </v-tooltip>
    </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAttrs } from 'vue'

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

const btnClick = (): void => {
    emit('click')
}
const attrs = useAttrs()

const buttonFontSize = computed<string>(() => {
    return attrs.size ? '' : 'defualt_size_icon'
})
</script>

<style lang="scss" scoped>
.defualt_size_icon {
    font-size: 18px;
}
</style>
