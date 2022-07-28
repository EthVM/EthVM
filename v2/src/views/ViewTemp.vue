<template>
    <v-row>
        <v-col cols="12">
            <v-card class="pa-6 mt-4" elevation="1" rounded="xl">
                <v-card-title class="mb-6">Hello I am a temp view for: {{ routeName }}</v-card-title>
                <v-row>
                    <v-col cols="12"> <app-btn></app-btn> </v-col>
                    <v-col cols="12">
                        <app-btn text="Small Button" isSmall icon="east"></app-btn>
                    </v-col>
                    <v-col cols="6">
                        <p class="text-caption">Default</p>
                        <app-btn-icon icon="content_copy" />
                    </v-col>
                    <v-col cols="6">
                        <p class="text-caption">Color + Tooltip Prop</p>
                        <app-btn-icon icon="content_copy" color="warning" tooltip-text="Hello" />
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
const routeName = computed(() => {
    return useRoute().name
})
</script>
<style lang="scss" scoped></style>
