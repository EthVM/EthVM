<template>
    <v-navigation-drawer v-model="appStore.appDrawer" color="primary" temporary location="right">
        <v-row justify="space-between" align="center" class="mt-2 mx-0">
            <app-change-network class="pl-2" />
            <v-spacer />
            <v-col cols="2">
                <app-btn-icon icon="close" @click="appStore.appDrawer = false" color="white" />
            </v-col>
        </v-row>

        <v-list bg-color="primary" lines="one">
            <template v-for="item in navItems" :key="item.header.text">
                <v-list-item
                    v-if="!item.links"
                    :title="item.header.text"
                    :value="item.header.routerLink"
                    :to="item.header.routerLink"
                    :active="item.header.routerLink === activeRoute"
                    :append-icon="item.header.icon"
                    class="py-3"
                ></v-list-item>
                <v-list-group v-else fluid eager>
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" :title="item.header.text" class="py-3"></v-list-item>
                    </template>
                    <v-divider class="mb-1" color="white" thickness="0.5px" />

                    <template v-for="(link, j) in item.links" :key="j">
                        <v-list-item
                            :to="link.isExternal ? undefined : link.routerLink"
                            :href="link.isExternal ? link.routerLink : undefined"
                            :target="link.isExternal ? '_blank' : '_self'"
                            :value="link.routerLink"
                            :title="link.text"
                            :active="link.routerLink === activeRoute"
                            class="pl-5"
                        >
                            <template v-if="link.img" v-slot:prepend>
                                <v-avatar rounded="lg" color="whiteLogo" :class="link.imgClass"><v-img :src="link.img"></v-img></v-avatar>
                            </template>
                            <p v-if="link.subtext" class="text-caption font-weight-light">{{ link.subtext }}</p>
                        </v-list-item>
                    </template>
                </v-list-group>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAppNavigation } from '../composables/AppNavigation/useAppNavigation.composable'
import { useStore } from '@/store'
import AppBtnIcon from './AppBtnIcon.vue'
import AppChangeNetwork from './AppChangeNetwork.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
const appStore = useStore()
const { navItems } = useAppNavigation()
const route = useRoute()
const activeRoute = computed(() => {
    return route.path
})
</script>
<style lang="scss" scoped></style>
