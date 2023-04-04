import { computed } from 'vue'
import Configs from '@/configs'
import { NETWORKS } from '@core/helper/networks'
export function useNetwork() {
    /**
     * Returns market info for ETH ONLY
     */
    const currencyName = computed<string>(() => {
        return NETWORKS[Configs.NETWORK].curr
    })

    return {
        currencyName
    }
}
