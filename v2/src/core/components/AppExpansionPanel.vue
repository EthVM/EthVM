<template>
    <v-row v-bind="$attrs" class="ml-4 ml-sm-6 mb-3 align-center justify-start">
        <!--
            Use title-content slot to insert image before title
        -->
        <slot name="title-content"></slot>
        <v-btn
            v-if="$slots['expand-content']"
            variant="text"
            rounded="pill"
            :class="[{ 'ml-n4': !$slots['title-content'] }, 'text-h6 font-weight-bold']"
            @click="expandPanel"
            >{{ props.title }} <v-icon class="ml-4" size="large">{{ icon }}</v-icon></v-btn
        >
        <p v-else class="text-h6 mr-3 font-weight-bold">{{ props.title }}</p>
    </v-row>
    <v-divider></v-divider>
    <v-card fluid width="auto" flat class="px-4 px-sm-6">
        <!--
            Use visible-content slot to show items that a visible when expansion panel is closed
        -->
        <slot name="visible-content"></slot>
    </v-card>
    <v-expand-transition>
        <v-card fluid v-if="expand" width="auto" flat class="px-4 px-sm-6">
            <!--
                Use expand-content slot to show items that a visible when expansion panel is opened
            -->
            <slot name="expand-content"></slot>
        </v-card>
    </v-expand-transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
/**
 * title @string - title of the expansion panel
 */
const props = defineProps({
    title: {
        type: String
    }
})

const emit = defineEmits<{
    (e: 'expand', expanded: boolean): void
}>()

/**
 * Controls visibility fo the expnaded content
 */
const expand = ref(false)

/**
 * Returns icon based on the expand ref
 */
const icon = computed<string>(() => {
    return expand.value ? 'expand_less' : 'expand_more'
})

/**
 * Toggles expand ref and emits the expand event to the parent
 */
const expandPanel = (): void => {
    expand.value = !expand.value
    emit('expand', expand.value)
}
</script>

<style lang="scss" scoped></style>
