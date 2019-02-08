<template>
  <v-card transparent flat width="350">

    <v-layout row align-center justify-space-around fill-height pa-3>

      <button flat class="bttnGrey info--text text-capitalize bttn" small>{{ $t('bttn.first') }}</button>
      <button flat class="bttnGrey info--text text-capitalize bttn" small><v-icon class="secondary--text" small>fas fa-angle-left</v-icon> </button>
      <div class="page-input">
        <v-text-field v-model="pageInput" :mask="inputMask" :placeholder="newPH" :rulles="inputRulles" class="centered-input body-1 secondary--text"></v-text-field>
      </div>
      <p class="total-text info--text">out of {{total}} </p>
      <button flat class="bttnGrey info--text text-capitalize bttn" small><v-icon class="secondary--text" small>fas fa-angle-right</v-icon> </button>
      <button flat class="bttnGrey info--text text-capitalize bttn" small>{{ $t('bttn.last') }}</button>

    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _debounce from 'lodash.debounce'
@Component
export default class AppPaginate extends Vue {
  //@Prop(Number) total!: button


  total = 10000
  page = 1
  pageInput = this.page
  validInput = true

  //Methods

  valid(_page: number): boolean {
    return (_page > 0 && _page <= this.total) ? true : false
  }

  setPage(): void {
    if(this.valid(this.pageInput)){
        this.page = this.pageInput
    }
  }

  // Watch
  @Watch('pageInput')
  onPageInputChanged(newVal: number, oldVal: number): void {
    let setNewPage = _debounce(this.setPage, 1500)
    setNewPage()
  }

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('page',  newVal - 1)
  }

  //Computed
  get inputRulles() {
    return [
      (input) => !!input || 'Page is required',
      (input) => this.valid(input) || "Invalid page number"
    ]
  }

  get inputMask(): string {
    let mask = "#"
    while(mask.length != this.total.toString().length) {
      mask += '#'
    }
    return mask
  }

  get newPH(): string {
   let place = this.page.toString()
    return place
  }
}
</script>

<style scoped lang="css">

.bttn{
  width: 48px;
  height: 32px;
}

.page-input{
  width: 1000px;
}

.centered-input input {
  text-align: center
}

p {
  margin: 0;
  padding: 0;
}

</style>
