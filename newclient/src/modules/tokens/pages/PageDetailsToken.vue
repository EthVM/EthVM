<template>
    <v-container grid-list-lg>
        <token-details :address-ref="addressRef" :is-holder="isHolder" :holder-address="holderAddress" @errorDetails="setError" />
        <app-error v-if="error" :has-error="hasError" :message="error" />
        <app-message :messages="errorMessages" />
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import TokenDetails from '@app/modules/tokens/handlers/tokenDetails/TokenDetails.vue'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import AppError from '@app/core/components/ui/AppError.vue'

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
    hasError = false
    errorMessages: ErrorMessageToken[] = []
    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

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
    Lifecycle
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

    setError(hasError: boolean, message: ErrorMessageToken): void {
        this.hasError = hasError
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
