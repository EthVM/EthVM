<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <v-layout row wrap justify-start class="mb-4">
            <v-flex xs12>
                <v-card
                    :class="{ 'pa-1': $vuetify.breakpoint.xsOnly, 'pa-3': $vuetify.breakpoint.smOnly, 'pa-5': $vuetify.breakpoint.mdAndUp }"
                    color="white"
                    flat
                >
                    <v-layout wrap grid-list-sm align-center column fill-height pa-2>
                        <v-flex xs12 align-self-start>
                            <v-card-title class="display-1 font-weight-bold pb-1">{{ $t('kb.title') }}</v-card-title>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout v-for="(term, index) in terms" :key="index" row wrap justify-start pa-2>
                                <v-card-title class="title pb-0">{{ $t(`${kb}${term}.term`) }}</v-card-title>
                                <v-card-text class="pt-2">{{ $t(`${kb}${term}.def`) }}</v-card-text>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Crumb } from '@app/core/components/props'
import { Component, Vue } from 'vue-property-decorator'

@Component({
    components: {
        AppBreadCrumbs
    }
})
export default class PageKnowledgeBase extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    kb = 'kb.terms.'

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get crumbs(): Crumb[] {
        return [
            {
                text: this.$t('kb.name')
            }
        ]
    }

    get terms(): string[] {
        return Object.keys(this.$i18n.t('kb.terms'))
    }
}
</script>
