<template>
    <v-img :src="require('@/assets/background-nebula.png')" contain />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppBtn from '@core/components/AppBtn.vue'

import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'

const { columnPadding, rowMargin } = useAppViewGrid()

const routeName = computed(() => {
    return useRoute().name
})

const props = defineProps({
    addressRef: {
        type: String,
        default: ''
    }
})
</script>
<style lang="scss" scoped>
.not-found {
    background: url('/src/assets/background-nebula.png');
    min-height: 600px;
}
</style>
