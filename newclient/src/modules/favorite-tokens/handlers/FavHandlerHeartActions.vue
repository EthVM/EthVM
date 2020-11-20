<template>
    <div>
        <!--
        =====================================================================================
          Button
        =====================================================================================
        -->
        <fav-btn-heart :is-added="isAdded" :tooltip-text="tooltipText" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { checkToken as checkTokenQuery } from './checkToken.graphql'
import FavBtnHeart from '@app/modules/favorite-tokens/components/FavBtnHeart.vue'
import { EnumAdrChips } from '@app/core/components/props'
import { FavActions as FavActionsMixin } from '@app/modules/favorite-tokens/mixins/FavActions.mixin'
import { ErrorMessagesFav } from '@app/modules/favorite-tokens/models/ErrorMessagesFav'
import { DataArray } from '@app/apollo/favorite-addresses/models'
import { CheckTokenRefetch } from '@app/modules/favorite-tokens/models/FavApolloRefetch'

@Component({
    components: {
        FavBtnHeart
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
                if (data && data.checkToken && data.checkToken.name) {
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
    @Prop(Array) addrChips!: EnumAdrChips[]
    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    checkToken!: boolean
    open = false
    symbol = ''
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    addToFav(symbol: string): void {
        this.mixinAddToFav(symbol, this.address, this.refetchCheckToken)
    }
    removeFromFav(): void {
        this.mixinRemoveFromFav(this.address, this.refetchCheckToken)
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get tooltipText(): string {
        return this.isAdded ? this.$t('fav.tooltip.remove').toString() : this.$t('fav.tooltip.add').toString()
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
            if (event.key === DataArray.addr) {
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
