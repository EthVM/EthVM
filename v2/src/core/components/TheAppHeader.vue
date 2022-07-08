<template>
    <v-app-bar color="white">
        <v-btn v-if="md || sm || xs" icon color="primary" @click.stop="$emit('openDrawer')">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-spacer />
        <v-toolbar-items> <module-search class="mb-n2 mt-8" /> </v-toolbar-items>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
// import AppSearch from './AppSearch.vue'
import ModuleSearch from '@module/search/ModuleSearch.vue'
/* Vuetify BreakPoints */
const { md, xs, sm } = useDisplay()
/*Define Emit Events */
defineEmits(['openDrawer'])
</script>
