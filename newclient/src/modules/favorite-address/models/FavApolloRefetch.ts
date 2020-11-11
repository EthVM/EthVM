import { DocumentNode } from 'graphql'
import { checkAddressVariables } from '@app/modules/favorite-address/handlers/apolloTypes/checkAddress'

export interface CheckAddressRefetch {
    query: DocumentNode
    variables: checkAddressVariables
}
