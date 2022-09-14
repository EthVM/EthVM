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
                    <v-icon class="secondary--text fas fa-angle-double-left" small>keyboard_double_arrow_left</v-icon>
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
                  Current Pages Text
                =====================================================================================
                -->
                <p class="info--text pr-1">{{ textDisplay }}</p>
                <!--
                =====================================================================================
                  Next Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="disableNext"
                    flat
                    class="bttnGrey info--text text-capitalize bttn"
                    small
                    @click="setPageOnClick('next')"
                    ><v-icon class="secondary--text" small>chevron_right</v-icon>
                </v-btn>
                <!--
                =====================================================================================
                  Last Item Button
                =====================================================================================
                -->
                <v-btn
                    v-if="state.hasLast"
                    variant="outlined"
                    color="primary"
                    :disabled="disableNext"
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
import { reactive, computed, watch } from 'vue'

const emit = defineEmits(['newPage'])

/*
 * =======================================================
 * PROPS
 * =======================================================
 */
const props = defineProps({
    hasMore: Boolean,
    loading: Boolean,
    currentPage: Number
})

/*
 * =======================================================
 * REFS
 * =======================================================
 */
interface ComponentState {
    hasLast: boolean
    lastPageLoad: number
}
const state: ComponentState = reactive({
    hasLast: false,
    lastPageLoad: 0
})

/*
 * =======================================================
 * METHODS
 * =======================================================
 */

/**
 * Emit event to parent component/view with updated page number.
 *
 * @param  {Number} - Page to emit to parent
 */
const emitNewPage = (page: number): void => {
    emit('newPage', page)
}

/**
 * On pagination button click, emit updated page number to parent component/view
 *
 * @param {String} value - Name of action to perform
 */
const setPageOnClick = (value: string): void => {
    switch (value) {
        case 'first':
            emitNewPage(0)
            break
        case 'prev':
            emitNewPage(Math.max(0, props.currentPage - 1))
            break
        case 'next':
            emitNewPage(props.currentPage + 1)
            break
        case 'last':
            emitNewPage(state.lastPageLoad)
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

/**
 * Transform the "zero-based" value of this.page into
 * a human-readable string that starts from 1 as opposed to 0
 * @return {string}
 */
const textDisplay = computed<string>(() => {
    return `of ${new BN(props.currentPage + 1).toFormat()}`
})

/**
 * Returns Class name of the input width
 * Determines width of the input according to the total page size
 *
 * @returns {string}
 */
const disableNext = computed<boolean>(() => {
    if (props.loading) {
        return true
    }
    if (state.hasLast) {
        return props.currentPage === state.lastPageLoad
    }
    return false
})

/*
 * =======================================================
 * WATCHER
 * =======================================================
 */
watch(
    () => props.currentPage,
    (newVal, oldVal) => {
        if (newVal > state.lastPageLoad && newVal > oldVal) {
            state.lastPageLoad = props.currentPage || 0
        }
    }
)

watch(
    () => props.hasMore,
    (newVal, oldVal) => {
        if (!newVal && oldVal) {
            state.hasLast = true
        }
    }
)
</script>

<style scoped lang="scss">
.v-btn {
    height: 30px;
    min-width: 20px;
    margin: 5px;
}

.page-input {
    width: 80px;
}

p {
    margin: 0;
    padding: 0;
}
</style>
