<template>
    <v-container grid-list-lg>
        <app-error v-if="hasError" :has-error="hasError" :message="error" />
        <app-message :messages="errorMessages" />
        <token-details :address-ref="addressRef" :is-holder="isHolder" :holder-address="holderAddress" @errorDetails="setError" />
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import TokenDetails from '@app/modules/tokens/handlers/tokenDetails/TokenDetails.vue'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'

@Component({
    components: {
        TokenDetails
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
      Computed
    ===================================================================================
    */

    get hasError(): boolean {
        return this.error !== ''
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    setError(hasError: boolean, message: ErrorMessageToken): void {
        if (hasError) {
            if (message === ErrorMessageToken.notFound) {
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
