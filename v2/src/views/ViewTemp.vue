<template>
    <v-row>
        <v-col cols="12">
            <p>Hello I am a temp view for: {{ routeName }}</p>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const routeName = computed(() => {
    return useRoute().name
})
</script>
