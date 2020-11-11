<template>
    <v-container grid-list-lg>
        <app-bread-crumbs :new-items="crumbs" />
        <fav-handler-address-list @errorFavorites="setError" />
        <app-error v-if="error" :has-error="hasError" :message="error" />
        <app-message :messages="errorMessages" />
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ErrorMessagesFav } from '@app/modules/favorite-addresses/models/ErrorMessagesFav'
import FavHandlerAddressList from '@app/modules/favorite-addresses/handlers/FavHandlerAddressList.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Crumb } from '@app/core/components/props'

@Component({
    components: {
        AppMessage,
        AppError,
        AppBreadCrumbs,
        FavHandlerAddressList
    }
})
export default class PageFavAddr extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop({ type: String }) addressRef!: string

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    error = ''
    hasError = false
    errorMessages: ErrorMessagesFav[] = []

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */
    /**
     * Returns breadcrumbs entry for this particular view.
     * Required for AppBreadCrumbs
     *
     * @return {Array} - Breadcrumb entry. See description.
     */
    get crumbs(): Crumb[] {
        return [
            {
                text: this.$t('fav.title')
            }
        ]
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    setError(hasError: boolean, message: ErrorMessagesFav): void {
        this.hasError = hasError
        if (hasError) {
            if (!this.errorMessages.includes(message)) {
                this.errorMessages.push(message)
            }
        } else {
            if (this.errorMessages.length > 0) {
                const index = this.errorMessages.indexOf(message)
                if (index > -1) {
                    this.errorMessages.splice(index, 1)
                }
            }
        }
    }
}
</script>
