<template>
    <v-card color="transparent" flat>
        <v-container grid-list-xs pa-1>
            <v-row row align="center" justify="end" fill-height class="flex-nowrap">
                <!--
                =====================================================================================
                  First Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="props.currentPage === 0"
                    flat
                    class="bttnGrey info--text text-capitalize bttn"
                    small
                    @click="setPageOnClick('first')"
                >
                    <v-icon class="secondary--text" small>keyboard_double_arrow_left</v-icon>
                </v-btn>
                <!--
                =====================================================================================
                  Prev Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="props.currentPage === 0"
                    flat
                    class="bttnGrey info--text text-capitalize bttn"
                    small
                    @click="setPageOnClick('prev')"
                >
                    <v-icon class="secondary--text" small>chevron_left</v-icon>
                </v-btn>
                <!--
                =====================================================================================
                  Input Container
                =====================================================================================
                -->
                <div class="pb-1 page-input">
                    <v-text-field
                        variant="underlined"
                        density="compact"
                        :hide-details="true"
                        single-line
                        v-model="pageDisplay"
                        :mask="inputMask"
                        :placeholder="pageDisplay"
                        :error="!isValidPageDisplay"
                        :class="[state.validClass, inputWidthClass, 'centered-input']"
                    />
                </div>
                <!--
                =====================================================================================
                  Total Pages Text
                =====================================================================================
                -->
                <v-tooltip v-if="hasTotalTooltip" color="white" content-class="tooltip-border" anchor="top">
                    <template #activator="{ props }">
                        <p class="info--text text-center total-p caption pl-1" v-bind="props">{{ showText }}</p>
                    </template>
                    <span class="black--text">of {{ hasTotalTooltip }}</span>
                </v-tooltip>
                <p v-else class="info--text text-center total-p caption pl-1">{{ showText }}</p>
                <!--
                =====================================================================================
                  Next Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="props.currentPage === lastPage"
                    flat
                    class="bttnGrey info--text text-capitalize bttn"
                    small
                    @click="setPageOnClick('next')"
                    ><v-icon class="secondary--text fas fa-angle-right" small>chevron_right</v-icon>
                </v-btn>
                <!--
                =====================================================================================
                  Last Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="props.currentPage === lastPage"
                    flat
                    class="bttnGrey info--text text-capitalize bttn caption"
                    small
                    @click="setPageOnClick('last')"
                    ><v-icon class="secondary--text" small>keyboard_double_arrow_right</v-icon>
                </v-btn>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import BN from 'bignumber.js'
import { reactive, computed } from 'vue'

const emit = defineEmits(['newPage'])

/*
 * =======================================================
 * PROPS
 * =======================================================
 */
const props = defineProps({
    total: Number,
    currentPage: Number
})

/*
 * =======================================================
 * REFS
 * =======================================================
 */
interface ComponentState {
    validClass: string
    invalidClass: string
    isError: boolean
    pageDisplayUpdateTimeout: number | null
}
const state: ComponentState = reactive({
    validClass: 'center-input body-1 secondary--text',
    invalidClass: 'center-input body-1 error--text',
    isError: false,
    pageDisplayUpdateTimeout: null
})

/*
 * =======================================================
 * METHODS
 * =======================================================
 */

const emitNewPage = (page: number): void => {
    emit('newPage', page)
}

const setPage = (page: number): void => {
    if (isValidPage(page) && page != props.currentPage) {
        emitNewPage(page)
    }
}

const isValidPage = (page: number): boolean => {
    return page >= 0 && page <= lastPage.value
}

const setPageOnClick = (value: string): void => {
    switch (value) {
        case 'first':
            emitNewPage(0)
            break
        case 'prev':
            emitNewPage(Math.max(0, props.currentPage - 1))
            break
        case 'next':
            emitNewPage(Math.min(lastPage.value, props.currentPage + 1))
            break
        case 'last':
            emitNewPage(lastPage.value)
            break
        default:
            break
    }
}

/*
 * =======================================================
 * COMPUTED
 * =======================================================
 */
const pageDisplay = computed({
    /**
     * Transform the "zero-based" value of this.page into
     * a human-readable string that starts from 1 as opposed to 0
     * @returns {string}
     */
    get() {
        return new BN(props.currentPage + 1).toFixed()
    },
    set(pageDisplay: string) {
        const desiredPage = parseInt(pageDisplay, 10) - 1
        ;(desiredPage >= 0 && desiredPage <= lastPage.value) || !pageDisplay ? (state.isError = false) : (state.isError = true)
        if (state.pageDisplayUpdateTimeout) {
            clearTimeout(state.pageDisplayUpdateTimeout)
        }
        state.pageDisplayUpdateTimeout = window.setTimeout(() => {
            setPage(desiredPage)
        }, 1000)
    }
})

/**
 * Returns Text for the total pages near the input
 *
 * @returns {string}
 */
const showText = computed<string>(() => {
    return `of ${new BN(props.total).toFormat()}`
})

/**
 * Determine if an given @number is within the valid page range.
 *
 * @return {Boolean}
 */
const isValidPageDisplay = computed<boolean>(() => {
    return !state.isError
})

/**
 * Display tooltip if totalPages >= 1k
 *
 * @return {string | undefined} - string IF totalPages >= 1k, undefined otherwise
 */
const hasTotalTooltip = computed<string | undefined>(() => {
    return props.total >= 1e3 ? new BN(props.total).toFormat() : undefined
})

/**
 * Property this.total is a human-readable number/length as opposed to a zero-based number.
 * The last possible page is zero-based, so this translates the human-readable number into zero-based
 *
 * @returns {number}
 */
const lastPage = computed<number>(() => {
    return props.total - 1
})

const inputMask = computed<string>(() => {
    let mask = '#'
    while (mask.length != props.total.toString().length) {
        mask += '#'
    }
    return mask
})

/**
 * Returns Class name of the input width
 * Determines width of the input accordign to the total page size
 *
 * @returns {string}
 */
const inputWidthClass = computed<string>(() => {
    if (props.total.toString().length < 3) {
        return 'x-sm'
    }
    if (props.total.toString().length < 6) {
        return 'sm'
    }
    if (props.total.toString().length < 9) {
        return 'md'
    }

    return 'lg'
})
</script>

<style scoped lang="scss">
.v-btn {
    height: 30px;
    min-width: 20px;
    margin: 5px;
}

.x-sm {
    max-width: 2em;
}
.sm {
    max-width: 3em;
}
.md {
    max-width: 5em;
}
.lg {
    max-width: 8em;
}

p {
    margin: 0;
    padding: 0;
}
.total-p {
    white-space: nowrap;
}
</style>
