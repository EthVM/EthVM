<template>
    <v-btn icon fab class="ma-1" @click="addToFav()"> <v-icon :class="iconClass" large></v-icon> </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { checkAddress, addFavAddress } from './addtoFav.graphql'
@Component({
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
    checkAddress?: boolean
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
    get iconClass(): string {
        return this.checkAddress ? 'far fa-heart red--text' : 'far fa-heart grey--text'
    }
}
</script>
