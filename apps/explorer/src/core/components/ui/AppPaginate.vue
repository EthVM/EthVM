<template>
  <v-card transparent flat width="350">
    <v-layout row align-center justify-space-around fill-height pa-3>

      <button flat class="bttnGrey info--text text-capitalize bttn" small>{{ $t('bttn.first') }}</button>
      <button flat class="bttnGrey info--text text-capitalize bttn" small><v-icon class="secondary--text" small>fas fa-angle-left</v-icon> </button>
      <div class="page-input">
        <v-text-field v-model="pageInput" :mask="inputMask" :placeholder="newPH" :rulles="validate" class="centered-input body-1 secondary--text"></v-text-field>
      </div>
      <p class="total-text info--text">out of {{total}} </p>
      <button flat class="bttnGrey info--text text-capitalize bttn" small><v-icon class="secondary--text" small>fas fa-angle-right</v-icon> </button>
      <button flat class="bttnGrey info--text text-capitalize bttn" small>{{ $t('bttn.last') }}</button>

    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component
export default class AppPaginate extends Vue {
  //@Prop(Number) total!: button

  pageInput = 10000
  total = 10000
  currPage = 1

  //Methods

  validate(_page: number):boolean {
    return (this.page > 0 && this.page <= this.total) ? true : false
  }

  // Watch
  @Watch('pageInput')
  onPageInputChanged(newVal: number, oldVal: number): void {
    let newPage = this._debounce(newVal, 1000)
    console.log(newPage)
  }

  mounted() {

  }

  //Computed
  get validate() {
    let a = (this.page > 0 && this.page <= this.total) ? true : "invalid page Number"
    console.log(a)
    return a
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
  width: 40px;
}

.centered-input input {
  text-align: center
}

p {
  margin: 0;
  padding: 0;
}

</style>
