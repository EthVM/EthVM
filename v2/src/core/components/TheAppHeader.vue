<template>
    <v-app-bar app color="primary" class="pa-0">
        <v-container class="mx-2 mx-sm-6 mx-md-auto mx-lg-6 mx-xl-auto pa-0">
            <v-row align="center mr-0 mx-lg-0">
                <v-app-bar-nav-icon v-if="showDrawerBtn" @click="appStore.appDrawer = !appStore.appDrawer" />
                <v-img :src="require('@/assets/logo-compact.png')" height="30" max-width="30" contain class="mr-2" />
                <v-spacer />
                <module-search class="mb-n2 mt-8" />
                <template v-if="!showDrawerBtn">
                    <template v-for="(item, index) in navItems" :key="index">
                        <v-btn
                            v-if="!item.links"
                            @click="navigateTo(item.header.routerLink || '')"
                            variant="plain"
                            rounded="0"
                            class="no-opacity header-button text-subtitle-1"
                        >
                            {{ item.header.text }}</v-btn
                        >
                        <v-btn v-else variant="plain" class="no-opacity text-subtitle-1" rounded="0">
                            {{ item.header.text }}
                            <v-icon class="ml-2">expand_more</v-icon>
                            <app-menu min-width="180" activator="parent" :items="item.links">
                                <template v-for="(link, j) in item.links" :key="j">
                                    <v-list-item @click="navigateTo(link.routerLink)" :value="link.routerLink" :title="link.text" class="primary--text">
                                    </v-list-item>
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

const { navItems, navigateTo } = useAppNavigation()
</script>
<style lang="scss">
.no-opacity {
    opacity: 1;
}
.header-button {
    &:hover {
        border-bottom: 3px solid white;
    }
}
</style>
