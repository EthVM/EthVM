<template>
    <v-container grid-list-lg class="mb-0">
        <token-details v-if="!hasError" :address-ref="addressRef" :is-holder="isHolder" :holder-address="holderAddress" @errorDetails="setError" />
        <app-error v-else :has-error="hasError" :message="error" />
        <app-message :messages="errorMessages" />
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import TokenDetails from '@app/modules/tokens/handlers/tokenDetails/TokenDetails.vue'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import { eth } from '@app/core/helper'

@Component({
    components: {
        TokenDetails,
        AppMessage,
        AppError
    }
})
export default class PageDetailsToken extends Vue {
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
    // Holder //
    isHolder = false // Whether or not "holder" is included in query params to display view accordingly
    holderAddress?: string = '' // Address of current token holder, if applicable
    error = ''
    errorMessages: ErrorMessageToken[] = []
    hasErrorHandler = false
    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

    created() {
        if (!this.isValid) {
            this.error = this.$i18n.t('message.invalid.token').toString()
        }

        window.scrollTo(0, 0)
    }

    /**
     * Set isHolder and holderAddress if found in route
     */
    async mounted() {
        const query = this.$route.query
        if (query.holder) {
            this.isHolder = true
            this.holderAddress = query.holder as string
        }
    }

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    get isValid(): boolean {
        return eth.isValidAddress(this.addressRef)
    }

    get hasError(): boolean {
        return this.error !== ''
    }

    /*
  ===================================================================================
   Watch
  ===================================================================================
  */

    /**
     * Watch $route/parameter changes.
     * If route updates with query param "holder", then fetch additional information
     * for that holder address.
     */
    @Watch('$route', { deep: true })
    onRouteChange() {
        const query = this.$route.query
        if (query.holder) {
            this.isHolder = true
            this.holderAddress = query.holder as string
        } else {
            this.isHolder = false
            this.holderAddress = undefined
        }
        window.scrollTo(0, 0)
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
    setError(hasError: boolean, message: ErrorMessageToken): void {
        this.hasErrorHandler = hasError
        if (hasError) {
            if (message === ErrorMessageToken.invalid) {
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
