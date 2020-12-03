import { DocumentNode } from 'graphql'
import { checkTokenVariables } from '@app/modules/favorite-tokens/handlers/apolloTypes/checkToken'

export interface CheckTokenRefetch {
    query: DocumentNode
    variables: checkTokenVariables
}
