import { DocumentNode } from 'graphql'
import { checkAddressVariables } from '@app/modules/favorite-addresses/handlers/apolloTypes/checkAddress'

export interface CheckAddressRefetch {
    query: DocumentNode
    variables: checkAddressVariables
}
