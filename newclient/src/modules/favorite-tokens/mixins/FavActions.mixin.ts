import { Component, Vue } from 'vue-property-decorator'
import { addFavToken, deleteFavToken } from './actions.graphql'
import { CheckTokenRefetch } from '@app/modules/favorite-tokens/models/FavApolloRefetch'

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
     * @param symbol: string, new address symbol
     * @return Promise boolean: true if action was sucessfull, otherwise false
     */
    async mixinAddToFav(symbol: string, address: string, _refetch?: CheckTokenRefetch[]): Promise<boolean> {
        const res = await this.$apollo
            .mutate({
                mutation: addFavToken,
                client: 'FavTokClient',
                variables: {
                    address: address,
                    symbol: symbol
                },
                refetchQueries: _refetch
            })
            .then(data => (data !== null ? true : false))
        return res
    }

    /**
     * Removes Address from the favorite list
     * @param address: string, new address hash
     * @return Promise boolean: true if action was sucessfull, otherwise false
     */
    async mixinRemoveFromFav(address: string, _refetch?: CheckTokenRefetch[]): Promise<boolean> {
        const res = await this.$apollo
            .mutate({
                mutation: deleteFavToken,
                client: 'FavTokClient',
                variables: {
                    address: address
                },
                refetchQueries: _refetch
            })
            .then(data => (data !== null ? true : false))
        return res
    }
}
