<template>
    <v-app-bar app flat :color="background" :class="['py-0 px-0 py-sm-2']">
        <v-container class="mx-2 mx-sm-6 mx-md-auto mx-lg-6 mx-xl-auto pa-0 text-white">
            <v-row align="center" justify="start" class="mr-0 mx-lg-0 flex-nowrap">
                <div class="mr-4 ml-4 logo-btn">
                    <v-img
                        :src="appStore.isDarkMode ? require('@/assets/logo-dark.svg') : require('@/assets/logo.svg')"
                        height="35"
                        :width="xs ? '80' : '100'"
                        contain
                        class="ml-3 ml-sm-none mr-auto logo-dark"
                        @click="goToHome"
                    />
                </div>
                <v-fade-transition hide-on-leave>
                    <module-search v-if="showSearchbar" class="justify-center mx-2 mx-sm-4" />
                </v-fade-transition>
                <v-spacer v-if="props.hideSearchBar && !showSearchbar"></v-spacer>

                <template v-if="!showDrawerBtn">
                    <template v-for="(item, index) in navItems" :key="index">
                        <v-btn v-if="!item.links" rounded="pill" :active="false" :to="item.header.routerLink" class="text-subtitle-1 font-weight-light">
                            {{ item.header.text }}
                            <v-icon v-if="item.header.icon" class="ml-3">{{ item.header.icon }}</v-icon>
                        </v-btn>
                        <v-btn v-else class="text-subtitle-1 font-weight-light" rounded="pill">
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
                <v-app-bar-nav-icon v-if="showDrawerBtn" @click="appStore.appDrawer = !appStore.appDrawer" />
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useAppNavigation } from '../composables/AppNavigation/useAppNavigation.composable'
import { useStore } from '@/store'
import ModuleSearch from '@/modules/search/ModuleAppSearch.vue'
import AppMenu from './AppMenu.vue'
import BigNumber from 'bignumber.js'
import { useRouter } from 'vue-router'
import { ROUTE_NAME } from '@core/router/routesNames'

/* Vuetify BreakPoints */
const { name, xs, lgAndUp } = useDisplay()

const props = defineProps({
    hideSearchBar: {
        default: true,
        type: Boolean
    },
    isTransparent: Boolean
})

const showDrawerBtn = computed<boolean>(() => {
    return name.value === 'xs' || name.value === 'sm' || name.value === 'md'
})

const appStore = useStore()

/*Define Emit Events */
defineEmits(['openDrawer'])
const { navItems } = useAppNavigation()

const router = useRouter()
const goToHome = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.HOME.NAME
    })
}

/*
===================================================================================
   Search Bar Handling
===================================================================================
*/

const offset = ref(0)

/**
 * Attaches event to the hide search bar prop on home page
 */
watch(
    () => props.hideSearchBar,
    newVal => {
        if (newVal) {
            window.addEventListener('scroll', onScroll)
        } else {
            window.addEventListener('scroll', onScroll)
        }
    }
)

watch(
    () => props.isTransparent,
    newVal => {
        if (newVal) {
            window.addEventListener('scroll', onScroll)
        } else {
            window.addEventListener('scroll', onScroll)
        }
    }
)

onMounted(() => {
    if (props.hideSearchBar || props.isTransparent) {
        window.addEventListener('scroll', onScroll)
    }
})

/**
 * Shows search bar whenever scroll threshhold is below 500
 */
const showSearchbar = computed<boolean>(() => {
    if (props.hideSearchBar) {
        const visibleAt = lgAndUp.value ? 352 : 440
        return offset.value > visibleAt
    }
    return true
})

const background = computed<string>(() => {
    if (props.isTransparent) {
        if (props.hideSearchBar) {
            if (offset.value < 131) {
                const transparency = new BigNumber(0.007634).multipliedBy(offset.value).toFixed()
                return `rgba(9,30,65, ${transparency})`
            }
        }
        if (offset.value < 120 && !props.hideSearchBar) {
            const transparency = new BigNumber(0.00833333333).multipliedBy(offset.value)
            return `rgba(9,30,65, ${transparency})`
        }
    }
    return 'primary'
})

const onScroll = () => {
    nextTick(() => {
        offset.value = window.scrollY
    })
}
</script>
<style scoped lang="scss">
.transparent-header {
    background: rgba(0, 0, 0, 0) !important;
}
.logo-btn {
    cursor: pointer;
}
</style>
