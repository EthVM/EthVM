<template>
    <v-app-bar app color="primary" class="pa-0">
        <v-container class="mx-2 mx-sm-6 mx-md-auto mx-lg-6 mx-xl-auto pa-0">
            <v-row align="center" class="mr-0 mx-lg-0">
                <v-app-bar-nav-icon v-if="showDrawerBtn" @click="appStore.appDrawer = !appStore.appDrawer" />
                <v-img :src="require('@/assets/logo-compact.png')" height="30" max-width="30" contain class="mr-2" />
                <v-spacer />
                <module-search class="mr-2" />
                <template v-if="!showDrawerBtn">
                    <template v-for="(item, index) in navItems" :key="index">
                        <v-btn v-if="!item.links" rounded="pill" :active="false" :to="item.header.routerLink" class="text-subtitle-1 font-weight-regular">
                            {{ item.header.text }}
                            <v-icon v-if="item.header.icon" class="ml-3">{{ item.header.icon }}</v-icon>
                        </v-btn>
                        <v-btn v-else class="text-subtitle-1 font-weight-regular" rounded="pill">
                            {{ item.header.text }}
                            <v-icon class="ml-1">expand_more</v-icon>
                            <app-menu min-width="180" activator="parent" :items="item.links">
                                <template v-for="(link, j) in item.links" :key="j">
                                    <v-list-item
                                        :to="link.isExternal ? undefined : link.routerLink"
                                        :href="link.isExternal ? link.routerLink : undefined"
                                        :target="link.isExternal ? '_blank' : '_self'"
                                        :value="link.routerLink"
                                        :title="link.text"
                                        class="primary--text py-3"
                                        :subtitle="link.subtext"
                                        ><template v-if="link.img" v-slot:prepend>
                                            <v-avatar rounded="0"><v-img :src="link.img"></v-img></v-avatar>
                                        </template>
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
const { navItems } = useAppNavigation()
</script>
