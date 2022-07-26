import { useDisplay } from 'vuetify'
import { computed } from 'vue'

/**
 * TEMP FIX for grid breakpoints:
 * USE when experiencing v-container incorrect max-width
 * @returns boolean
 */
export function useAppIsFluid() {
    const { md, xl, xxl } = useDisplay()
    const isFluidView = computed<boolean>(() => {
        return !(md.value || xl.value || xxl.value)
    })
    return {
        isFluidView
    }
}
