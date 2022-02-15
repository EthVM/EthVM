<template>
    <v-card color="white" flat>
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
                    <v-layout pa-2 align-center justify-start>
                        <v-flex xs5 sm4>
                            <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                        </v-flex>
                    </v-layout>
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
            <v-flex xs12>
                <app-details-list-row :detail="item" :is-loading="isLoading" />
            </v-flex>
        </div>

        <!--
    =====================================================================================

      MORE DETAILS

      Iterate through each moreDetails[] items if applicable.
      These will only display if showMore === true.

    =====================================================================================
    -->
        <v-slide-y-transition v-if="!isLoading && showMore" group>
            <div v-for="(item, index) in moreDetails" :key="calculateKey(index)" :class="[getColor(index) ? '' : 'tableGrey']">
                <v-flex xs12>
                    <app-details-list-row :detail="item" :is-loading="isLoading" />
                </v-flex>
            </div>
        </v-slide-y-transition>
        <div v-if="hasMore && !isLoading">
            <v-btn v-if="!showMore" flat block class="secondary" @click="setShowMore(true)"> <v-icon class="fa fa-angle-down white--text"></v-icon> </v-btn>
            <v-btn v-else flat block class="secondary" @click="setShowMore(false)"> <v-icon class="fa fa-angle-up white--text"></v-icon> </v-btn>
        </div>
    </v-card>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppDetailsListRow from '@app/core/components/ui/AppDetailsListRow.vue'

@Component({
    components: {
        AppDetailsListRow
    }
})
export default class AppDetailsList extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(String) title!: string
    @Prop(Array) details!: Detail[]
    @Prop(Boolean) isLoading!: boolean
    @Prop({ type: Number, default: 99 }) maxItems!: number
    @Prop({ type: Boolean, default: true }) hasTitle!: boolean

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    showMore = false // Whether or not to show "more" details

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
    calculateKey(index): number {
        return index + this.maxItems
    }

    /**
     * Sets the boolean flag for showMore.
     * This will determine whether or not to show "more" details.
     */
    setShowMore(bool): void {
        this.showMore = bool
    }

    /**
     * Sets row color to grey.
     */
    getColor(_index: number): boolean {
        return _index % 2 === 0
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    /**
     * Returns a new array of "basic" details.
     * This array will display no matter what,
     * without having to click the "more" button.
     *
     * @return {Detail[]}
     */
    get basicDetails(): Detail[] {
        return this.details.slice(0, this.maxItems)
    }

    /**
     * Returns a new array of "more" details.
     * This will only happen if the details array is longer
     * than maxItems.
     *
     * @return {Detail[]}
     */
    get moreDetails(): Detail[] {
        return this.details.splice(this.maxItems)
    }

    /**
     * Determine if details list has "more" details to display.
     *
     * @return {Boolean}
     */
    get hasMore(): boolean {
        return this.moreDetails.length > 0
    }
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
