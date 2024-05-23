<template>
    <div>
        <!-- <NuxtWelcome /> -->

        <NuxtLayout>
            <v-app>
                <the-app-navigation-drawer />
                <the-app-header :hide-search-bar="false" :is-transparent="false" />
                <v-main>
                    <v-container class="px-2 px-sm-6 px-md-0 px-lg-6 px-xl-0 pt-4 pt-sm-6">
                        <!-- <router-view /> -->
                    </v-container>
                </v-main>
                <the-app-footer />
            </v-app>
        </NuxtLayout>
    </div>
</template>
