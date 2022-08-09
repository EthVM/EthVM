<template>
    <div>
        <v-row v-if="isHome" align="center" justify="space-between" class="pb-1 pr-2 pl-2 my-0">
            <v-col cols="6" class="pl-0">
                <v-card-title class="title font-weight-bold pl-1">{{ props.title }}</v-card-title>
            </v-col>
            <v-spacer />
            <v-col class="flex-grow-0">
                <v-btn :to="props.pageLink" outline color="secondary" class="text-capitalize ma-0">View All</v-btn>
            </v-col>
        </v-row>
        <v-row v-else align="center" class="mx-0" row wrap fill-height pa-2>
            <v-col grow class="title-live">
                <v-row align="center" justify="start" row wrap pa-1 class="my-0">
                    <v-card-title class="title font-weight-bold pl-1">{{ props.title }} </v-card-title>
                    <p v-if="hasCaption" class="info--text pl-1">{{ props.titleCaption }}</p>
                    <slot name="update" />
                </v-row>
            </v-col>
            <v-spacer />
            <v-col v-if="props.hasPagination && !smAndDown" shrink hidden-sm-and-down>
                <slot name="pagination" />
            </v-col>
            <v-col cols="12" v-if="!mdAndUp" hidden-md-and-up>
                <v-row align-center justify-center pa-2>
                    <slot name="filter" />
                </v-row>
            </v-col>
            <v-col v-if="props.hasPagination && !mdAndUp" cols="12" hidden-md-and-up>
                <v-row align-center justify-center pa-2>
                    <slot name="pagination" />
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { mdAndUp, smAndDown } = useDisplay()

const props = defineProps({
    title: String,
    pageLink: String,
    titleCaption: {
        type: String,
        default: ''
    },
    pageType: {
        type: String,
        default: 'home'
    },
    hasPagination: {
        type: Boolean,
        default: false
    }
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const hasCaption = computed<boolean>(() => {
    return props.titleCaption !== ''
})
</script>
