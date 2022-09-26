<template>
    <v-card color="greyCard" class="pa-4 pa-sm-6 align-center d-flex justify-center" flat :min-height="xs ? 66 : 112">
        <p class="text-info text-center">
            <span><v-icon class="mr-2">info</v-icon></span
            >{{ props.text }}
        </p>
    </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs } = useDisplay()

/*
===================================================================================
  PROPS:
===================================================================================
*/

const props = defineProps({
    text: {
        type: String,
        default: ''
    }
})
</script>
