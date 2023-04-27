import { computed, Ref, watch, ref } from 'vue'
import { useEnsResolveNameQuery } from './ensResolveName.generated'
import { Resolution } from '@unstoppabledomains/resolution'
import * as Sentry from '@sentry/vue'
import namehash from '@ensdomains/eth-ens-namehash'
import { useNetwork } from '../Network/useNetwork'

export function useResolveName(name: Ref<string | undefined>) {
    const UD_SUPPORTED_TLDS = ['blockchain', 'bitcoin', 'crypto', 'nft', 'wallet', 'x', 'dao', '888', 'zil']
    /**
     * For Refference:
     * https://unstoppabledomains.github.io/resolution/v1.17.0/classes/resolutionerror.html
     */
    const UD_ERROR_EXCEPTIONS = [
        'is not registered',
        'no record was found',
        "domain resolver doesn't have any address of specified currency",
        'domain is not owned by any address',
        'domain has no resolver specified'
    ]

    const { ensId, unstoppableId } = useNetwork()

    const udResolution = new Resolution({
        sourceConfig: {
            uns: {
                locations: {
                    Layer1: {
                        url: 'https://nodes.mewapi.io/rpc/eth',
                        network: 'mainnet'
                    },
                    Layer2: {
                        url: 'https://nodes.mewapi.io/rpc/matic',
                        network: 'polygon-mainnet'
                    }
                }
            }
        }
    })

    /**
     * @param _name {string} - entire string including TLF. ie 'myetherwallet.eth'
     * @returns {string} tld of the domain. ie 'eth'
     */
    const getTld = (_name: string): string => {
        const labels = _name.split('.')
        return labels.length < 2 ? '' : labels[labels.length - 1]
    }

    /**
     * computed property
     * @returns {boolean} weather or not name has valid Unstoppable Domain TLD
     */
    const isValidTldUD = computed<boolean>(() => {
        return name.value ? UD_SUPPORTED_TLDS.includes(getTld(name.value)) : false
    })

    /**
     * resolved Unstoppable Domain address if any
     */
    const resolvedUD: Ref<undefined | string> = ref(undefined)

    /**
     * property loading Unstoppable Domain resolver
     */
    const udLoading = ref(false)

    /**
     * Watches for changes in provided name.
     * Resposible to resolve Unstoppable Domain name if name is valid.
     * Resets resolvedUD on name changed.
     */
    watch(name, (newVal, oldVal) => {
        if (unstoppableId.value && newVal && newVal !== oldVal) {
            resolvedUD.value = undefined
            if (isValidTldUD.value) {
                udLoading.value = true
                udResolution
                    .addr(newVal, unstoppableId.value)
                    .then(address => {
                        resolvedUD.value = address
                        udLoading.value = false
                    })
                    .catch(error => {
                        udLoading.value = false
                        let isException = false
                        let i = UD_ERROR_EXCEPTIONS.length
                        while (i > 0 && !isException) {
                            if (error.includes(UD_ERROR_EXCEPTIONS[i - 1])) {
                                isException = true
                            }
                            --i
                        }
                        if (!isException) {
                            Sentry.captureException(`ERROR in useResolveName unstoppable: tried resolving ${newVal}, ${error}`)
                        }
                    })
            }
        }
    })

    /**
     * computed property
     * @returns {boolean} weather or not name has valid ENS TLD
     */
    const isValidTldEns = computed<boolean>(() => {
        if (!ensId.value || !name.value) {
            return false
        }
        return getTld(name.value).length > 2
    })

    const normalizeEns = computed<string | undefined>(() => {
        try {
            const normalized = namehash.normalize(name.value)
            return isValidTldEns.value ? namehash.hash(normalized) : undefined
        } catch {
            return undefined
        }
    })
    /**
     * Fetches Ens resolution from Graph.
     * ensRes - raw data
     * ensLoading - property loading ENS Domain resolver
     */
    const { result: ensRes, loading: ensLoading } = useEnsResolveNameQuery(
        () => ({
            hash: normalizeEns.value || ''
        }),
        () => ({
            clientId: 'ensClient',
            fetchPolicy: 'cache-first',
            enabled: isValidTldEns.value
        })
    )

    /**
     * computed property
     * @returns {boolean} weather or not name has valid Unstoppable Domain TLD
     */
    const resolvedEns = computed<string | undefined>(() => {
        if (isValidTldEns.value) {
            if (!ensLoading.value && ensRes?.value && ensRes?.value?.domains.length > 0) {
                return ensRes.value.domains[0].resolvedAddress?.id
            }
        }
        return undefined
    })

    /**
     * computed property
     * @returns {boolean} weather or not name has valid Unstoppable Domain TLD
     */
    const loading = computed<boolean>(() => {
        return ensLoading.value || udLoading.value
    })

    /**
     * computed property
     * @returns {string | undefined} resolved address
     */
    const resolvedAdr = computed<string | undefined>(() => {
        return resolvedEns.value || resolvedUD.value || undefined
    })

    const isValidTld = computed<boolean>(() => {
        return isValidTldEns.value || isValidTldUD.value
    })

    return { ensRes, loading, resolvedAdr, isValidTld }
}
