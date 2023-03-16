import { computed, Ref } from 'vue'
import { useEnsResolveNameQuery } from './ensResolveName.generated'

export function useResolveName(name: Ref<string | undefined>) {
    const isValidTld = computed<boolean>(() => {
        if (!name.value) {
            return false
        }
        const labels = name.value.split('.')
        return labels.length < 2 ? false : labels[labels.length - 1].length > 2
    })

    const { result: ensRes, loading: ensLoading } = useEnsResolveNameQuery(
        () => ({
            name: name.value
        }),
        () => ({
            clientId: 'ensClient',
            fetchPolicy: 'cache-first',
            enabled: isValidTld.value
        })
    )

    const loading = computed<boolean>(() => {
        return ensLoading.value
    })

    const resolvedEns = computed<string | undefined>(() => {
        if (isValidTld.value) {
            if (!ensLoading.value && ensRes?.value && ensRes?.value?.domains.length > 0) {
                return ensRes.value.domains[0].resolvedAddress?.id
            }
        }
        return undefined
    })

    const resolvedAdr = computed<string | undefined>(() => {
        return isValidTld.value ? resolvedEns.value : undefined
    })

    return { ensRes, loading, resolvedAdr }
}
