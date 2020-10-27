import { DocumentNode } from 'graphql'
import { checkAddressVariables } from '@app/modules/favorites/handlers/apolloTypes/checkAddress'

export interface CheckAddressRefetch {
    query: DocumentNode
    variables: checkAddressVariables
}
