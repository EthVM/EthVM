<template>
    <div>
        <v-layout v-if="isHome" align-center justify-space-between row wrap fill-height pb-1 pr-2 pl-2>
            <v-flex xs6>
                <v-card-title class="title font-weight-bold pl-1">{{ title }}</v-card-title>
            </v-flex>
            <v-spacer />
            <v-flex shrink>
                <v-btn :to="pageLink" outline color="secondary" class="text-capitalize ma-0">{{ $t('btn.view-all') }}</v-btn>
            </v-flex>
        </v-layout>
        <v-layout v-else align-center row wrap fill-height pa-2>
            <v-flex grow class="title-live">
                <v-layout align-center justify-start row wrap pa-1>
                    <v-card-title class="title font-weight-bold pl-1">{{ title }} </v-card-title>
                    <p v-if="hasCaption" class="info--text pl-1">{{ titleCaption }}</p>
                    <slot name="update" />
                </v-layout>
            </v-flex>
            <v-spacer />
            <v-flex v-if="hasPagination" shrink hidden-sm-and-down>
                <slot name="pagination" />
            </v-flex>
            <v-flex xs12 hidden-md-and-up>
                <v-layout align-center justify-center pa-2>
                    <slot name="filter" />
                </v-layout>
            </v-flex>
            <v-flex v-if="hasPagination" xs12 hidden-md-and-up>
                <v-layout align-center justify-center pa-2>
                    <slot name="pagination" />
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class AppTableTitle extends Vue {
    /*
    ===================================================================================
      Props
    ==================================================================================
  */

    @Prop(String) title?: string
    @Prop(String) pageLink?: string
    @Prop({ type: String, default: 'home' }) pageType!: string
    @Prop({ type: String, default: '' }) titleCaption!: string
    @Prop({ type: Boolean, default: false }) hasPagination!: boolean

    /*
    ===================================================================================
      Computed
    ==================================================================================
  */

    get isHome(): boolean {
        return this.pageType === 'home'
    }

    get hasCaption(): boolean {
        return this.titleCaption !== ''
    }
}
</script>
