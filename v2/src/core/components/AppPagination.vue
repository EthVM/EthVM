<template>
    <v-pagination v-model="page" class="my-4" :length="pageLength" active-color="primary" total-visible="6" size="small" variant="flat" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface ComponentProps {
    length: number
    hasNext?: boolean
}

const props = withDefaults(defineProps<ComponentProps>(), {
    hasNext: false
})

const page = ref<number>(1)
const pageLength = computed<number>(() => {
    return props.hasNext ? props.length + 1 : props.length
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
