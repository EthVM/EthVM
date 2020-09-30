<template>
    <fav-btn-add-to-fav :is-added="checkAddress" :add-address="addToFav" :tooltip-text="tooltipText"></fav-btn-add-to-fav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { checkAddress, addFavAddress } from './addtoFav.graphql'
import FavBtnAddToFav from '@app/modules/favorites/components/FavBtnAddToFav.vue'

@Component({
    components: {
        FavBtnAddToFav
    },
    apollo: {
        checkAddress: {
            query: checkAddress,
            client: 'FavClient',
            fetchPolicy: 'cache-and-network',
            variables() {
                return {
                    address: this.address
                }
            },
            result({ data }) {
                console.log('hello', data)
            }
        }
    }
})
export default class FavHandlerLike extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String) address!: string

    /*
    ===================================================================================
      Data
    ===================================================================================
    */
    checkAddress!: boolean
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    addToFav(): void {
        this.$apollo.mutate({
            mutation: addFavAddress,
            client: 'FavClient',
            variables: {
                address: this.address
            }
        })
        this.$apollo.queries.checkAddress.refresh()
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get tooltipText(): string {
        return this.checkAddress ? this.$t('fav.tooltip.remove').toString() : this.$t('fav.tooltip.add').toString()
    }
}
</script>
