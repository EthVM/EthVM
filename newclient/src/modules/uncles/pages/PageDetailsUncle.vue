<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <!--
    =====================================================================================
      UNCLE DETAILS LIST
    =====================================================================================
    -->
        <uncle-details v-if="isValid" :uncle-ref="uncleRef" />
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { eth } from '@app/core/helper'
import { Detail, Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import UncleDetails from '@app/modules/uncles/handlers/UncleDetails.vue'

@Component({
    components: {
        AppBreadCrumbs,
        UncleDetails
    }
})
export default class PageDetailsUncle extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String }) uncleRef!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    error = ''

    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

    created() {
        // Check that current uncle ref is valid

        if (!this.isValid) {
            this.error = this.$i18n.t('message.invalid.uncle').toString()
            return
        }

        window.scrollTo(0, 0)
    }

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    /**
     * Determines whether or not the uncleRef is valid.
     *
     * @return {Boolean}
     */
    get isValid(): boolean {
        return eth.isValidHash(this.uncleRef)
    }

    /**
     * Returns breadcrumbs entry for this particular view.
     * Required for AppBreadCrumbs
     *
     * @return {Array} - Breadcrumb entry. See description.
     */
    get crumbs(): Crumb[] {
        return [
            {
                text: this.$tc('uncle.name', 2),
                link: '/uncles'
            },
            {
                text: this.$tc('uncle.name', 1),
                hash: this.uncleRef
            }
        ]
    }
}
</script>
