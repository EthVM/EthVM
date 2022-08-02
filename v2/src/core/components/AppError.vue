<template>
    <div v-if="props.hasError">
        <v-card flat class="pa-5">
            <v-row class="error--text headline justify-center align-center">Error</v-row>
            <v-row class="justify-center subheading text-md-center">
                {{ props.message }}
            </v-row>
        </v-card>
    </div>
</template>

<script setup lang="ts">
defineProps({
    hasError: {
        type: Boolean
    },
    message: {
        type: String
    }
})
</script>
