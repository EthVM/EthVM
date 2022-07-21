<template>
    <v-app-bar app color="primary" class="px-2 px-sm-6 px-xl-auto">
        <v-container class="core-header">
            <v-row align="center">
                <v-app-bar-nav-icon v-if="showDrawerBtn" @click="appStore.appDrawer = !appStore.appDrawer" />
                <v-img :src="require('@/assets/logo-compact.png')" height="30" max-width="30" contain class="mr-2" />
                <v-spacer />
                <module-search class="mb-n2 mt-8" />
                <template v-if="!showDrawerBtn">
                    <template v-for="(item, index) in navItems" :key="index">
                        <v-btn v-if="!item.links" :to="item.header.routerLink" variant="text">
                            <v-icon class="mr-1">{{ item.header.icon }}</v-icon
                            >{{ item.header.text }}</v-btn
                        >
                        <v-btn v-else variant="text">
                            <v-icon class="mr-1">{{ item.header.icon }}</v-icon>
                            {{ item.header.text }}
                            <v-icon class="ml-2">mdi-chevron-down</v-icon>
                            <app-menu min-width="180" activator="parent" :items="item.links">
                                <template v-for="(link, j) in item.links" :key="j">
                                    <v-list-item :to="link.routerLink" :value="link.routerLink" :title="link.text"> </v-list-item>
                                </template>
                            </app-menu>
                        </v-btn>
                    </template>
                </template>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'
import { useAppNavigation } from '../composables/AppNavigation/useAppNavigation.composable'
import { useStore } from '@/store'
import { storeToRefs } from 'pinia'
// import AppSearch from './AppSearch.vue'
import ModuleSearch from '@module/search/ModuleSearch.vue'
import AppMenu from './AppMenu.vue'
/* Vuetify BreakPoints */
const { name } = useDisplay()
const showDrawerBtn = computed<boolean>(() => {
    return name.value === 'xs' || name.value === 'sm' || name.value === 'md'
})

const appStore = useStore()

/*Define Emit Events */
defineEmits(['openDrawer'])

const { navItems } = useAppNavigation()
</script>
<style lang="scss">
.core-header {
    @media (min-width: 960px) {
        width: 960px !important;
    }
    @media (min-width: 1240px) {
        width: 100% !important;
    }
    @media (min-width: 1439px) {
        width: 1390px !important;
    }
}
</style>
