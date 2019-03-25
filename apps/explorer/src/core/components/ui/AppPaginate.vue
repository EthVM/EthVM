<template>
  <v-card color="transparent" flat min-width="240" max-width="340">
    <v-container grid-list-xs pa-1>
      <v-layout row align-center justify-end fill-height>
        <v-btn v-if="hasFirst" flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('first')" small>{{ $t('btn.first') }}</v-btn>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('prev')" small
          ><v-icon class="secondary--text" small>fas fa-angle-left</v-icon>
        </v-btn>
        <div v-if="hasInput" class="page-input">
          <v-text-field v-model="pageDisplay" :mask="inputMask" :placeholder="pageDisplay" :error="!isValidPageDisplay" :class="validClass" />
        </div>
        <p v-else class="info--text pr-1">{{ pageDisplay }}</p>
        <p class="info--text">out of {{ total }}</p>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('next')" small
          ><v-icon class="secondary--text" small>fas fa-angle-right</v-icon>
        </v-btn>
        <v-btn v-if="hasLast" flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('last')" small>{{ $t('btn.last') }}</v-btn>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _debounce from 'lodash.debounce'

@Component
export default class AppPaginate extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Number) total!: number
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
  pageDisplayUpdateTimeout = null // Timeout object to update page with override of pageDisplay input model

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
    if (this.isValidPage(page) && page !== this.currentPage) {
      this.emitNewPage(page)
    }
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
        this.emitNewPage(Math.min(this.lastPage, this.currentPage + 1))
        break
      case 'last':
        this.emitNewPage(this.lastPage)
        break
      default:
        break
    }
  }

  /**
   * Determine if an given @number is within the valid page range.
   *
   * @page {Number} - Page number to be validated
   * @return {Boolean}
   */
  isValidPage(page: number): boolean {
    return page >= 0 && page <= this.lastPage
  }

  /*
  ===================================================================================
    Set Values
  ===================================================================================
  */

  /**
   * Upon manually updating computed property pageDisplay,
   * setPage() with desired updated value (and emit to parent component/view)
   * Set timeout is used to give the user adequate time to type in their desired page.
   * Lodash _debounce is not used because it immediately triggers upon change as opposed
   * to waiting 500ms initially.
   */
  set pageDisplay(pageDisplay: string) {
    const desiredPage = parseInt(pageDisplay, 10) - 1
    ;(desiredPage >= 0 && desiredPage <= this.lastPage) || !pageDisplay ? (this.isError = false) : (this.isError = true)
    clearTimeout(this.pageDisplayUpdateTimeout)
    this.pageDisplayUpdateTimeout = setTimeout(() => {
      this.setPage(desiredPage)
    }, 500)
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
    return (this.currentPage + 1).toString()
  }

  /**
   * Determine if an given @number is within the valid page range.
   *
   * @return {Boolean}
   */
  get isValidPageDisplay(): boolean {
    return !this.isError
  }

  /**
   * Property this.total is a human-readable number/length as opposed to a zero-based number.
   * The last possible page is zero-based, so this translates the human-readable number into zero-based
   */
  get lastPage(): number {
    return this.total - 1
  }

  get inputMask(): string {
    let mask = '#'
    while (mask.length != this.total.toString().length) {
      mask += '#'
    }
    return mask
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
