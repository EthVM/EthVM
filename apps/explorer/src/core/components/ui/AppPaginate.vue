<template>
  <v-card transparent flat width="360">

    <v-layout row align-center justify-space-around fill-height pa-3>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('first')" small>{{ $t('bttn.first') }}</v-btn>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('prev')"small><v-icon class="secondary--text" small>fas fa-angle-left</v-icon> </v-btn>
      <div class="page-input">
        <v-text-field v-model="pageInput" :mask="inputMask" :placeholder="newPH" :error="!valid(pageInput)" :class="validClass" ></v-text-field>
      </div>
      <p class="total-text info--text">out of {{total}} </p>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('next')" small><v-icon class="secondary--text" small>fas fa-angle-right</v-icon> </v-btn>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('last')" small>{{ $t('bttn.last') }}</v-btn>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _debounce from 'lodash.debounce'
@Component
export default class AppPaginate extends Vue {
  @Prop(Number) total!: number

  page = 1
  pageInput = this.page
  validClass = 'center-input body-1 secondary--text'
  invalidClass = 'center-input body-1 error--text'

  //Methods

  valid(_page: number): boolean {
    return (_page > 0 && _page <= this.total) ? true : false
  }

  setPage(): void {
    if(this.valid(this.pageInput)){
        this.page = this.pageInput
    }
  }

  setPageOnClick(_value: string): void {
    switch(_value){
      case 'first':
        this.page = 1
        break
      case 'prev':
        if(this.valid(this.page - 1)) {
          this.page -= 1
        }
        break
      case 'next':
        if(this.valid(this.page + 1)){
          this.page +=1
        }
        break
      case 'last':
        this.page = this.total
        break
      default:
        break
    }
    this.pageInput = this.page
  }

  // Watch
  @Watch('pageInput')
  onPageInputChanged(newVal: number, oldVal: number): void {
    let setNewPage = _debounce(this.setPage, 500)
    setNewPage()
  }

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    console.log(newVal)
    this.$emit('page',  newVal - 1)
  }

  //Computed

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

.v-btn {
  height: 30px;
  min-width: 45px;
  margin: 0
}

.page-input{
  width: 45px;
}

.center-input {
  text-align: center
}

p {
  margin: 0;
  padding: 0;
}

</style>
