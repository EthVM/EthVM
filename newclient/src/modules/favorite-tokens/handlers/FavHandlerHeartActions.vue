<template>
    <div>
        <!--
        =====================================================================================
          Button
        =====================================================================================
        -->
        <app-btn-heart :is-added="isAdded" :btn-click="clickBtn" :tooltip-text="tooltipText" :is-small="isSmall" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { checkToken as checkTokenQuery } from './checkToken.graphql'
import AppBtnHeart from '@app/core/components/ui/AppBtnHeart.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { FavActions as FavActionsMixin } from '@app/modules/favorite-tokens/mixins/FavActions.mixin'
import { ErrorMessagesFav } from '@app/modules/favorite-tokens/models/ErrorMessagesFav'
import { DataArray } from '@app/apollo/favorite-tokens/models'
import { CheckTokenRefetch } from '@app/modules/favorite-tokens/models/FavApolloRefetch'

@Component({
    components: {
        AppBtnHeart
    },
    apollo: {
        checkToken: {
            query: checkTokenQuery,
            client: 'FavTokClient',
            fetchPolicy: 'network-only',
            variables() {
                return {
                    address: this.address
                }
            },
            result({ data }) {
                if (data && data.checkToken && data.checkToken.symbol) {
                    if (data.checkToken.symbol !== '') {
                        this.emitErrorState(false)
                    }
                } else {
                    this.emitErrorState(false)
                }
            },
            error(error) {
                this.emitErrorState(true, ErrorMessagesFav.addressCheck)
            }
        }
    }
})
export default class FavHandlerHeartActions extends Mixins(FavActionsMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String) address!: string
    @Prop(String) symbol!: string
    @Prop(Array) addrChips!: EnumAdrChips[]
    @Prop({ type: Boolean, default: false }) isSmall!: boolean

    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    checkToken!: boolean
    open = false
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    clickBtn(): void {
        !this.isAdded ? this.mixinAddToFav(this.symbol, this.address, this.refetchCheckToken) : this.mixinRemoveFromFav(this.address, this.refetchCheckToken)
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get tooltipText(): string {
        return this.isAdded ? this.$t('token.remove').toString() : this.$t('token.add').toString()
    }

    get isAdded(): boolean {
        return this.checkToken !== undefined && this.checkToken !== null
    }

    get refetchCheckToken(): CheckTokenRefetch[] {
        return [
            {
                query: checkTokenQuery,
                variables: {
                    address: this.address
                }
            }
        ]
    }

    /*
    ===================================================================================
      Lifecycle:
    ===================================================================================
    */
    mounted() {
        window.addEventListener('storage', event => {
            if (event.key === DataArray.token) {
                this.$apollo.queries.checkToken.refresh()
            }
        })
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    emitErrorState(val: boolean, message: string): void {
        this.$emit('errorFavorites', val, message)
    }
}
</script>
