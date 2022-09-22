<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="py-6" elevation="1" rounded="xl">
                <v-card-title class="mb-6">Hello I am a temp view for: {{ routeName }}, {{ props.addressRef }}</v-card-title>
                <v-row>
                    <v-col cols="12" class="px-10"> <app-btn></app-btn> </v-col>
                    <v-col cols="12" class="px-10">
                        <app-btn text="Small Button" isSmall icon="east"></app-btn>
                    </v-col>
                    <v-col cols="6" class="px-10">
                        <p class="text-caption">Default</p>
                        <app-btn-icon icon="content_copy" />
                    </v-col>
                    <v-col cols="6">
                        <p class="text-caption">Color + Tooltip Prop</p>
                        <app-btn-icon icon="content_copy" color="warning" tooltip-text="Hello" />
                    </v-col>
                    <v-col cols="12" class="px-10">
                        <app-chip bg="success" text="From" />
                        <app-chip bg="orange" text="To" />
                        <app-chip bg="warning" color="text-info" text="Self" />
                    </v-col>
                    <v-col cols="12">
                        <app-expansion-panel title="Default Expansion Panel" class="pt-3">
                            <template #visible-content>
                                <p v-for="i in 3" :key="i">Hello {{ i }}</p></template
                            >
                            <template #expand-content>
                                <p v-for="i in 3" :key="i + 3">Hello {{ i + 3 }}</p></template
                            ></app-expansion-panel
                        >
                    </v-col>
                    <v-col cols="12">
                        <app-expansion-panel title="EP with img slot" class="pt-3">
                            <template #title-content>
                                <v-img :src="require('@/assets/icon-token.png')" height="24" max-width="24" class="mr-2"></v-img>
                            </template>
                            <template #visible-content>
                                <p v-for="i in 3" :key="i">Hello {{ i }}</p></template
                            >
                            <template #expand-content>
                                <p v-for="i in 3" :key="i + 3">Hello {{ i + 3 }}</p></template
                            ></app-expansion-panel
                        >
                    </v-col>
                    <v-col cols="12">
                        <app-expansion-panel title="EP without expand content slot" class="pt-3">
                            <template #visible-content>
                                <p v-for="i in 3" :key="i">Hello {{ i }}</p></template
                            >
                        </app-expansion-panel>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import AppChip from '@/core/components/AppChip.vue'
import AppExpansionPanel from '@/core/components/AppExpansionPanel.vue'
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
<style lang="scss" scoped></style>
