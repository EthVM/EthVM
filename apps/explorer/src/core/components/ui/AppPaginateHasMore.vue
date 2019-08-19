<template>
  <v-card color="transparent" flat max-width="340">
    <v-container grid-list-xs pa-1>
      <v-layout row align-center justify-end fill-height>
        <v-btn v-if="hasFirst" flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('first')" small>{{ $t('btn.first') }}</v-btn>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('prev')" small :disabled="currentPage === 0"
          ><v-icon class="secondary--text" small>fas fa-angle-left</v-icon>
        </v-btn>
        <p class="info--text pr-1">{{ pageDisplay }}</p>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('next')" small :disabled="!hasMore"
          ><v-icon class="secondary--text" small>fas fa-angle-right</v-icon>
        </v-btn>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
    import { Component, Mixins, Prop } from 'vue-property-decorator'
    import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
    import BigNumber from 'bignumber.js'

    @Component
export default class AppPaginate extends Mixins(NumberFormatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Boolean) hasMore!: boolean
  @Prop(Number) currentPage!: number
  @Prop({ type: Boolean, default: true }) hasFirst!: boolean
  @Prop({ type: Boolean, default: true }) hasLast!: boolean
  @Prop({ type: Boolean, default: true }) hasInput!: boolean

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  validClass = 'center-input body-1 secondary--text'
  invalidClass = 'center-input body-1 error--text'
  isError = false
  pageDisplayUpdateTimeout: number | null = null // Timeout object to update page with override of pageDisplay input model

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Emit event to parent compoent/view with updated page number.
   *
   * @param  {Number} - Page to emit to parent
   */
  emitNewPage(page: number) {
    this.$emit('newPage', page)
  }

  /**
   * If desired page is within valid page range, emit new page.
   *
   * @param {Number} page - Desired page to traverse
   */
  setPage(page: number) {
    this.emitNewPage(page)
  }

  /**
   * On pagination button click, emit updated page number to parent component/view
   *
   * @param {String} value - Name of action to perform
   */
  setPageOnClick(value: string): void {
    switch (value) {
      case 'first':
        this.emitNewPage(0)
        break
      case 'prev':
        this.emitNewPage(Math.max(0, this.currentPage - 1))
        break
      case 'next':
        this.emitNewPage(this.currentPage + 1)
        break
      default:
        break
    }
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Transform the "zero-based" value of this.page into
   * a human-readable string that starts from 1 as opposed to 0
   */
  get pageDisplay(): string {
    return this.formatIntegerValue(new BigNumber(this.currentPage + 1)).value
  }
}
</script>

<style scoped lang="css">
.v-btn {
  height: 30px;
  min-width: 20px;
  margin: 5px;
}

.page-input{
  width: 80px;
}

p {
  margin: 0;
  padding: 0;
}
</style>
