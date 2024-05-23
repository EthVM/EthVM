<template>
    <v-navigation-drawer v-model="appDrawer" color="primary" temporary location="right">
        <v-row justify="space-between" align="center" class="mt-2 mx-0">
            <app-change-network class="pl-2" />
            <v-spacer />
            <v-col cols="2">
                <app-btn-icon icon="close" color="white" @click="appDrawer = false" />
            </v-col>
        </v-row>

        <v-list bg-color="primary" lines="one">
            <template v-for="item in navItems" :key="item.header.text">
                <v-divider v-if="item.header.text === $t('home.footer.settings')"></v-divider>
                <v-list-item
                    v-if="!item.links"
                    :title="item.header.text"
                    :value="item.header.routerLink"
                    :href="item.header.routerLink"
                    :active="false"
                    :append-icon="item.header.icon"
                    class="py-3"
                ></v-list-item>
                <v-list-group v-else fluid eager>
                    <template #activator="{ props }">
                        <v-list-item v-bind="props" :title="item.header.text" class="py-3"></v-list-item>
                    </template>
                    <v-divider class="mb-1" color="white" thickness="0.5px" />

                    <template v-for="(link, j) in item.links" :key="j">
                        <v-list-item :href="link.routerLink" target="_self" :value="link.routerLink" :title="link.text" :active="false" class="pl-5">
                            <template v-if="link.img" #prepend>
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
/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
const appDrawer = useAppDrawer()
const { navItems } = useAppNavigation()
</script>
<style lang="scss" scoped></style>
