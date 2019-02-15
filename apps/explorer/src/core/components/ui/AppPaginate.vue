<template>
  <v-card transparent flat min-width="240" max-width="340">
    <v-container grid-list-xs pa-1>
      <v-layout row align-center justify-end fill-height>
        <v-btn v-if="hasFirst" flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('first')" small>{{ $t('bttn.first') }}</v-btn>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('prev')" small
          ><v-icon class="secondary--text" small>fas fa-angle-left</v-icon>
        </v-btn>
        <div v-if="hasInput" class="page-input">
          <v-text-field v-model="pageInput" :mask="inputMask" :placeholder="newPH" :error="!isValid(pageInput)" :class="validClass"></v-text-field>
        </div>
        <p v-else class="info--text pr-1">{{ pageInput }}</p>
        <p class="info--text">out of {{ total }}</p>
        <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('next')" small
          ><v-icon class="secondary--text" small>fas fa-angle-right</v-icon>
        </v-btn>
        <v-btn v-if="hasLast" flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('last')" small>{{ $t('bttn.last') }}</v-btn>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _debounce from 'lodash.debounce'

@Component
export default class AppPaginate extends Vue {
  @Prop(Number) total: number
  @Prop(Number) newPage: number
  @Prop(Number) currentPage: number
  @Prop({ type: Boolean, default: true }) hasFirst: boolean
  @Prop({ type: Boolean, default: true }) hasLast: boolean
  @Prop({ type: Boolean, default: true }) hasInput: boolean

  page = 0
  pageInput = '1'
  validClass = 'center-input body-1 secondary--text'
  invalidClass = 'center-input body-1 error--text'

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  /**
   * When this.currentPage changes (updated via a prop from parent component),
   * update this.page with the corresponding value.
   * This is done in order to sync the displayed this.pageInput value on multiple components
   * that may be in the same view.
   * However, this can trigger the @onPageChanged event on other AppPaginate components,
   * so care must be taken in parent components in order not to fetch the same data twice.
   */
  @Watch('currentPage')
  onCurrentPageChanged(newVal: number, oldVal: number) {
    if (this.currentPage !== this.page) {
      this.page = this.currentPage
    }
  }

  /**
   * When this.page changes, emit event with the new this.page value.
   * Also, ensure that this.pageInput is properly transformed for display.
   */
  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.pageInput = this.transformPageToPageInput()
    console.log(this.page, 'AppPaginate > onPageChanged')
    this.$emit('newPage', this.page)
  }

  /**
   * When this.pageInput changes, properly transform and update thus.page.
   */
  @Watch('pageInput')
  onPageInputChanged(newVal: string, oldVal: string): void {
    const setNewPage = _debounce(this.setPage, 500)
    setNewPage()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Transform the "zero-based" value of this.page into
   * a human-readable string that starts from 1 as opposed to 0
   *
   * @return {String}
   */
  transformPageToPageInput(): string {
    return (this.page + 1).toString()
  }

  /**
   * Transform the human-reable value of this.pageInput into
   * an "zero-based" number that starts from 0 as opposed to 1
   *
   * @return {Number}
   */
  transformPageInputToPage(): number {
    return parseInt(String(this.pageInput), 10) - 1
  }

  /**
   * Determine if an given @number is within the valid page range.
   *
   * @page {Number} - Page number to be validated
   * @return {Boolean}
   */
  isValid(page: number): boolean {
    return page >= 0 && page <= this.total - 1
  }

  /**
   * When attempting to manually set the the page number via this.pageInput,
   * confirm that the transformed value of this.page is valid.
   * I.E. this.pageInput === 1 --> desiredPage === 0 --> this.isValid --> this.page === 0
   */
  setPage() {
    const desiredPage = this.transformPageInputToPage()
    if (this.isValid(desiredPage)) {
      this.page = desiredPage
    }
  }

  /**
   * Set this.page to the correct value based on passed string.
   *
   * @param {String} value
   */
  setPageOnClick(value: string): void {
    switch (value) {
      case 'first':
        this.page = 0
        break
      case 'prev':
        this.page = Math.max(0, this.page - 1)
        break
      case 'next':
        this.page = Math.min(this.total - 1, this.page + 1)
        break
      case 'last':
        this.page = this.total - 1
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

  get inputMask(): string {
    let mask = '#'
    while (mask.length != this.total.toString().length) {
      mask += '#'
    }
    return mask
  }

  get newPH(): string {
    const place = this.page.toString()
    return place
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
