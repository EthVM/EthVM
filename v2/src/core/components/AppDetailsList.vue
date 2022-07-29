<template>
    <v-card flat>
        <!--
    =====================================================================================

      TITLE

      If isLoading, show placeholder bar, otherwise display title.
      A <slot name="title" /> also exists for custom title components,
      such as BlockDetails

    =====================================================================================
    -->
        <div v-if="hasTitle">
            <slot name="title">
                <div v-if="isLoading">
                    <v-row align="center" justify="start" class="pa-2">
                        <v-col xs="5" sm="4">
                            <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                        </v-col>
                    </v-row>
                    <v-divider class="lineGrey mt-1 mb-1" />
                </div>
                <div v-else class="pb-1 pt-1">
                    <div class="pa-1">
                        <v-card-title class="title font-weight-bold pl-4">{{ title }}</v-card-title>
                    </div>
                    <v-divider class="lineGrey mt-1 mb-1" />
                </div>
            </slot>
        </div>
        <!--
    =====================================================================================

      DETAILS

      Iterate through each basicDetails[] item and create list.
      If isLoading, show placeholder bar instead of item detail,
      otherwise display item detail.
      Expects a details object populated with the details.title, regardless of
      other data being populated

    =====================================================================================
    -->

        <div v-for="(item, index) in basicDetails" :key="calculateKey(index)" :class="[getColor(calculateKey(index)) ? '' : 'tableGrey']">
            <v-col xs="12">
                <app-details-list-row :detail="item" :is-loading="isLoading" />
            </v-col>
        </div>

        <!--
    =====================================================================================

      MORE DETAILS

      Iterate through each moreDetails[] items if applicable.
      These will only display if showMore === true.

    =====================================================================================
    -->
        <v-expand-transition v-show="!isLoading && state.showMore">
            <div>
                <div v-for="(item, index) in moreDetails" :key="calculateKey(index)" :class="[getColor(index) ? '' : 'tableGrey']">
                    <v-col xs="12">
                        <app-details-list-row :detail="item" :is-loading="isLoading" />
                    </v-col>
                </div>
            </div>
        </v-expand-transition>
        <div v-if="hasMore && !isLoading">
            <v-btn v-if="!state.showMore" flat block color="primary" @click="setShowMore(true)">
                <v-icon class="fa fa-angle-down white--text">expand_more</v-icon>
            </v-btn>
            <v-btn v-else flat block color="primary" @click="setShowMore(false)">
                <v-icon class="fa fa-angle-up white--text">expand_less</v-icon>
            </v-btn>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Detail } from '@/core/components/props'
import AppDetailsListRow from '@/core/components/AppDetailsListRow.vue'

interface Props {
    details: Detail[]
    title?: string
    isLoading: boolean
    maxItems: number
    hasTitle?: boolean
}
// eslint-disable-next-line
const { details, title, hasTitle = true, maxItems = 99, isLoading } = defineProps<Props>()

const state = reactive({
    showMore: false
})

/**
 * Returns a new array of "basic" details.
 * This array will display no matter what,
 * without having to click the "more" button.
 *
 * @return {Detail[]}
 */
const basicDetails = computed<Detail[]>(() => {
    return details.slice(0, maxItems)
})

/**
 * Returns a new array of "more" details.
 * this will only happen if the details array is longer
 * than maxItems.
 *
 * @return {Detail[]}
 */
const moreDetails = computed<Detail[]>(() => {
    return details.slice(maxItems)
})

/**
 * Determine if details list has "more" details to display.
 *
 * @return {Boolean}
 */
const hasMore = computed<boolean>(() => {
    return moreDetails.value.length > 0
})

/*
===================================================================================
    Methods
===================================================================================
*/

/**
 * Calculate the key for the v-for directive.
 *
 * @return {Number}
 */
const calculateKey = (index: number): number => {
    return index + maxItems
}

/**
 * Sets the boolean flag for showMore.
 * This will determine whether or not to show "more" details.
 */
const setShowMore = (bool: boolean): void => {
    state.showMore = bool
}

/**
 * Sets row color to grey.
 */
const getColor = (_index: number): boolean => {
    return _index % 2 === 0
}
</script>
<style scoped lang="css">
.details-list-title-loading {
    width: 300px;
    height: 20px;
    background: #e6e6e6;
    border-radius: 2px;
}
</style>
