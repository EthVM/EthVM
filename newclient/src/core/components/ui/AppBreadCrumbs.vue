<template>
    <v-card flat color="transparent" class="mt-2 mb-4">
        <v-layout row wrap align-center justify-start pa-2>
            <v-card-title class="crumb-container">
                <v-icon :class="[isHome ? 'black--text  pr-2' : 'info--text  pr-2']" small>fa fa-home</v-icon>
                <router-link :class="[isHome ? 'black--text' : 'info--text']" to="/">{{ $t('home') }}</router-link>
            </v-card-title>
            <p v-if="!isHome" class="pr-1 caption">/</p>

            <v-card-title v-for="(item, i) in newItems" :key="i" class="crumb-container">
                <p v-if="item.link">
                    <router-link :class="['info--text']" :to="item.link">{{ getText(item) }}</router-link>
                </p>
                <div v-else>
                    <p class="black--text">{{ getText(item) }}</p>
                </div>
                <p v-if="i < newItems.length - 1" class="pl-1 pr-0 caption">/</p>
            </v-card-title>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Crumb } from '@app/core/components/props'

@Component
export default class AppBreadCrumbs extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Array) newItems!: Crumb[]

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Gets text
     * @param item Crumb
     * @returns {String}
     */
    getText(item: Crumb): string {
        return item.hash ? `${item.text}: ${this.getHash(item.hash)}` : `${item.text}`
    }
    /**
     * Gets hash and returns concatenated version
     * @param hash {String}
     * @returns {String}
     */
    getHash(hash: string): string {
        const n = hash.length
        return `${hash.slice(0, 4)}...${hash.slice(n - 4, n)}`
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get isHome(): boolean {
        return !this.newItems
    }
}
</script>

<style scoped lang="css">
.crumb-container {
    min-width: fit-content;
    padding: 0px 0px;
    margin-right: 0.5em;
}
</style>
