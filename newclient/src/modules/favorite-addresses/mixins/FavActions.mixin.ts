import { Component, Vue } from 'vue-property-decorator'
import { addFavAddress, deleteFavAddress } from './actions.graphql'
import { CheckAddressRefetch } from '@app/modules/favorite-addresses/models/FavApolloRefetch'

@Component
export class FavActions extends Vue {
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    /**
     * Adds Address to the favorite list
     * @param address: string, new address hash
     * @param name: string, new address name
     * @return Promise boolean: true if action was sucessfull, otherwise false
     */
    async mixinAddToFav(name: string, address: string, _refetch?: CheckAddressRefetch[]): Promise<boolean> {
        const res = await this.$apollo
            .mutate({
                mutation: addFavAddress,
                client: 'FavAddrClient',
                variables: {
                    address: address,
                    name: name
                },
                refetchQueries: _refetch
            })
            .then(data => (data !== null ? true : false))
        return res
    }

    /**
     * Removes Address from the favorite list
     * @param address: string, new address hash
     * @param name: string, new address name
     * @return Promise boolean: true if action was sucessfull, otherwise false
     */
    async mixinRemoveFromFav(address: string, _refetch?: CheckAddressRefetch[]): Promise<boolean> {
        const res = await this.$apollo
            .mutate({
                mutation: deleteFavAddress,
                client: 'FavAddrClient',
                variables: {
                    address: address
                },
                refetchQueries: _refetch
            })
            .then(data => (data !== null ? true : false))
        return res
    }
}
