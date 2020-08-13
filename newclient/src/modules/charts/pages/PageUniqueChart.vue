<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
    </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Crumb } from '@app/core/components/props'

@Component({
    components: {
        AppBreadCrumbs
    }
})
export default class PageUniqueChart extends Vue {
    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
    get crumbs(): Crumb[] {
        const translationsId = `charts.${this.chartId.replace(/_/g, '-').toLowerCase()}.title`
        console.log(translationsId)
        return [
            {
                text: this.$t('charts.name'),
                link: '/charts'
            },
            {
                text: this.$t(translationsId)
            }
        ]
    }

    get chartId(): string {
        return this.$route.params.chartRef
    }
}
</script>
