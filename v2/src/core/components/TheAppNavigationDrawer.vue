<template>
    <v-navigation-drawer color="primary" v-model="state.drawer">
        <v-row dense justify="center" align="center">
            <v-col cols="2">
                <v-img :src="require('@/assets/logo-compact.png')" height="30px" width="30px" contain class="mx-auto" />
            </v-col>
            <v-col cols="9" class="text-caption">
                <p>Ethereum Explorer V2</p>
                <p>powered by MEW</p>
            </v-col>
        </v-row>
        <v-list bg-color="primary" class="my-3" lines="two">
            <template v-for="(item, index) in navItems" :key="index">
                <v-list-item
                    v-if="!item.links"
                    :prepend-icon="item.header.icon"
                    :title="item.header.text"
                    :to="item.header.routerLink"
                    :value="item.header.routerLink"
                    class=""
                ></v-list-item>
                <v-list-group v-else>
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" :prepend-icon="item.header.icon" :title="item.header.text"></v-list-item>
                    </template>
                    <template v-for="(link, j) in item.links" :key="j">
                        <v-list-item :to="link.routerLink" :value="link.routerLink" :title="link.text"> </v-list-item>
                    </template>
                </v-list-group>
            </template>
        </v-list>
    </v-navigation-drawer>
    <the-app-header @open-drawer="openDrawer" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ROUTE_NAME } from '../router/routesNames'
/* COMPONENTS */
import TheAppHeader from './TheAppHeader.vue'
/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
const state = reactive({ drawer: true })

const openDrawer = () => {
    state.drawer = !state.drawer
}

/**
 * Nav Items
 */
interface NavMenuEntry {
    header: NavHeader
    links?: NavLink[]
}

interface NavLink {
    text: string
    routerLink: string
}

interface NavHeader {
    text: string
    icon: string
    routerLink?: string
}

const navItems = reactive<NavMenuEntry[]>([
    {
        header: {
            icon: 'mdi-home',
            text: 'Home',
            routerLink: ROUTE_NAME.HOME.PATH
        }
    },
    {
        header: {
            icon: 'mdi-cube-outline',
            text: 'Blocks',
            routerLink: ROUTE_NAME.BLOCKS.PATH
        }
    },
    {
        header: {
            text: 'Transactions',
            icon: 'mdi-swap-horizontal'
        },
        links: [
            {
                text: 'Mined Txs',
                routerLink: ROUTE_NAME.TXS.PATH
            },
            {
                text: 'Pending Txs',
                routerLink: ROUTE_NAME.TXS_PENDING.PATH
            }
        ]
    },
    {
        header: {
            text: 'Tokens',
            icon: 'mdi-ethereum'
        },
        links: [
            {
                text: 'Market data',
                routerLink: ROUTE_NAME.TOKENS.PATH
            },
            {
                text: 'Favorites',
                routerLink: ROUTE_NAME.FAV_TOKENS.PATH
            }
        ]
    },
    {
        header: {
            icon: 'mdi-chart-bar',
            text: 'Charts',
            routerLink: ROUTE_NAME.CHARTS.PATH
        }
    },
    {
        header: {
            icon: 'mdi-cards-heart',
            text: 'Favorite addresses',
            routerLink: ROUTE_NAME.FAV_ADDRESS.PATH
        }
    }
])
</script>
