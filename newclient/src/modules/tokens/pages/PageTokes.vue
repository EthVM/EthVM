<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-message :messages="errorMessages" />
        <v-card v-if="isRopsten" :class="{ 'pa-1': $vuetify.breakpoint.xsOnly, 'pa-3': $vuetify.breakpoint.smOnly, 'pa-5': $vuetify.breakpoint.mdAndUp }" flat>
            <v-layout align-center justify-center column class="mb-4">
                <v-flex xs12>
                    <v-img :src="require('@/assets/no-data.png')" min-width="250px" min-height="10px" contain></v-img>
                </v-flex>
                <v-layout row>
                    <v-spacer />
                    <v-flex xs12 sm9 md7>
                        <v-card-text class="font-weight-thin font-italic text-xs-center"
                            >{{ $t('message.ropsten-no-token.text')
                            }}<a href="https://www.ethvm.com/tokens">{{ $t('message.ropsten-no-token.link') }} </a></v-card-text
                        >
                    </v-flex>
                    <v-spacer />
                </v-layout>
            </v-layout>
        </v-card>
        <tokens-market-info-table v-else :max-items="maxItems" @errorDetails="setError" />
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokensMarketInfoTable from '@app/modules/tokens/handlers/tokensMarketInfo/TokensMarketInfo.vue'
import { Crumb } from '@app/core/components/props'
// import { TokenExchange } from '@app/modules/tokens/props'
// import { ConfigHelper } from '@app/core/helper/config-helper'
import { Component, Vue } from 'vue-property-decorator'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import AppMessage from '@app/core/components/ui/AppMessage.vue'

const MAX_ITEMS = 20

@Component({
    components: {
        AppBreadCrumbs,
        TokensMarketInfoTable,
        AppMessage
    }
})
export default class PageTokens extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    // isRopsten = ConfigHelper.isRopsten
    isRopsten = false
    errorMessages: ErrorMessageToken[] = []

    /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

    mounted() {
        window.scrollTo(0, 0)
    }

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
                text: this.$tc('token.name', 2)
            }
        ]
    }

    get maxItems(): number {
        return MAX_ITEMS
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
