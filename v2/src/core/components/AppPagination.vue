<template>
    <v-pagination v-model="page" class="my-4" :length="pageLength" active-color="primary" total-visible="6" size="small" variant="flat" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

interface ComponentProps {
    length: number
    hasMore?: boolean
    currentPage?: number
}

const props = withDefaults(defineProps<ComponentProps>(), {
    hasMore: false
})

const page = ref<number>(1)
const pageLength = computed<number>(() => {
    return props.hasMore ? props.length + 1 : props.length
})

watch(
    () => props.currentPage,
    () => {
        if (props.currentPage) {
            page.value = props.currentPage
        }
    }
)

onMounted(() => {
    if (props.currentPage) {
        page.value = props.currentPage
    }
})
</script>

<style scoped lang="scss">
.v-pagination {
    :deep(.v-pagination__list) {
        justify-content: flex-end;
    }

    :deep(.v-btn--size-small) {
        width: 32px;
        height: 24px;
        border-radius: 24px;
    }
}
</style>
