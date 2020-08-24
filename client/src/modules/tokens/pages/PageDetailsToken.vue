<template>
    <v-container grid-list-lg>
        <token-details :address-ref="addressRef" :is-holder="isHolder" :holder-address="holderAddress" />
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import TokenDetails from '@app/modules/tokens/handlers/tokenDetails/TokenDetails.vue'

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
}
</script>
