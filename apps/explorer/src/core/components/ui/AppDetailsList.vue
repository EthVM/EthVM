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
    <div v-if="isLoading && !hasError">
      <v-card-title class="title font-weight-bold pl-4">
        <div style="width: 300px; height: 20px; background: #e6e6e6; border-radius: 2px;"></div>
      </v-card-title>
    </div>
    <div v-else>
      <slot name="title">
        <div v-if="!hasError">
          <v-card-title class="title font-weight-bold pl-4" v-html="title"></v-card-title>
          <v-divider class="lineGrey" />
        </div>
      </slot>
    </div>
    <!--
    =====================================================================================

      LOADING/ERROR

      If isLoading, show v-progress-linear bar
      If hasError, show AppError

    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="isLoading && !hasError" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />
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
    <v-list-tile v-if="!hasError" v-for="(item, index) in basicDetails" :key="calculateKey(index)" :class="[getColor(index) ? '' : 'tableGrey']">
      <app-details-list-row :detail="item" :is-loading="isLoading" :index="index" />
    </v-list-tile>
    <!--
    =====================================================================================

      MORE DETAILS

      Iterate through each moreDetails[] items if applicable.
      These will only display if showMore === true.

    =====================================================================================
    -->
    <v-slide-y-transition group v-if="!hasError && showMore">
      <v-list-tile v-for="(item, index) in moreDetails" :key="calculateKey(index)" :class="[getColor(index) ? '' : 'tableGrey']">
        <app-details-list-row :detail="item" :is-loading="isLoading" :index="index" />
      </v-list-tile>
    </v-slide-y-transition>
    <div v-if="hasMore && !isLoading">
      <v-btn v-if="!showMore" @click="setShowMore(true)" flat block class="secondary"> <v-icon class="fa fa-angle-down white--text"></v-icon> </v-btn>
      <v-btn v-else @click="setShowMore(false)" flat block class="secondary"> <v-icon class="fa fa-angle-up white--text"></v-icon> </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AppError from '@app/core/components/ui/AppError.vue'
import AppDetailsListRow from '@app/core/components/ui/AppDetailsListRow.vue'

@Component({
  components: {
    AppError,
    AppDetailsListRow
  }
})
export default class AppDetailsList extends Vue {
  @Prop(String) title!: string
  @Prop(Array) details: Detail[]
  @Prop(Boolean) isLoading: boolean
  @Prop(String) error: string
  @Prop({ type: Number, default: 99 }) maxItems

  showMore = false // Whether or not to show "more" details

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Calculate the key for the v-for directive.
   *
   * @return {String}
   */
  calculateKey(index): string {
    return `${index + this.maxItems}`
  }

  /**
   * Sets the boolean flag for showMore.
   * This will determine whether or not to show "more" details.
   */
  setShowMore(bool): void {
    this.showMore = bool
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasError(): boolean {
    return this.error !== ''
  }

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
  getColor(_index: number): boolean {
    return _index % 2 === 0
  }
}
</script>
