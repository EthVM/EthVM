<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-error v-if="hasError" :has-error="hasError" :message="error" />
        <app-message :messages="errorMessages" />

        <!--
    =====================================================================================
      UNCLE DETAILS LIST
    =====================================================================================
    -->
        <uncle-details v-if="isValid && !hasError" :uncle-ref="uncleRef" @errorDetails="setError" />
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import { eth } from '@app/core/helper'
import { Detail, Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import UncleDetails from '@app/modules/uncles/handlers/UncleDetails.vue'
import { ErrorMessageUncle } from '@app/modules/uncles/models/ErrorMessagesForUncle'
@Component({
    components: {
        AppBreadCrumbs,
        AppError,
        AppMessage,
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
    errorMessages: ErrorMessageUncle[] = []

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

    get hasError(): boolean {
        return this.error !== ''
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
                text: this.$tc('block.name', 2),
                link: '/blocks'
            },
            {
                text: this.$tc('uncle.name', 1),
                hash: this.uncleRef
            }
        ]
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets error if any
     * @param hasError {Boolean}
     * @param message {ErrorMessageToken}
     */
    setError(hasError: boolean, message: ErrorMessageUncle): void {
        if (hasError) {
            if (message === ErrorMessageUncle.notFound) {
                this.error = this.$i18n.t(message).toString()
            } else {
                if (!this.errorMessages.includes(message)) {
                    this.errorMessages.push(message)
                }
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
