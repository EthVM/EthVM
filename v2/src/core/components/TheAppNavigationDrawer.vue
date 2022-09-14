<template>
    <v-navigation-drawer v-model="appStore.appDrawer" color="primary" temporary>
        <v-row dense justify="space-between" align="center" class="mt-2">
            <v-col cols="3">
                <v-img :src="require('@/assets/logo-compact.png')" height="30px" width="30px" contain class="mx-auto" />
            </v-col>
            <v-col cols="2">
                <app-btn-icon icon="close" @click="appStore.appDrawer = false" color="white" />
            </v-col>
        </v-row>
        <v-list bg-color="primary" lines="two">
            <template v-for="(item, index) in navItems" :key="index">
                <v-list-item
                    v-if="!item.links"
                    :prepend-icon="item.header.icon"
                    :title="item.header.text"
                    :value="item.header.routerLink"
                    class=""
                    @click="navigateTo(item.header.routerLink || '')"
                ></v-list-item>
                <v-list-group v-else>
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" :prepend-icon="item.header.icon" :title="item.header.text"></v-list-item>
                    </template>
                    <template v-for="(link, j) in item.links" :key="j">
                        <v-list-item @click="navigateTo(link.routerLink)" :value="link.routerLink" :title="link.text"> </v-list-item>
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
/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
const appStore = useStore()
const { navItems, navigateTo } = useAppNavigation()
</script>
