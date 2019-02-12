<template>
  <v-card transparent flat min-width="240" max-width="320">
    <v-container grid-list-xs pa-1>
    <v-layout row align-center justify-space-between fill-height pa-1>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('first')" small>{{ $t('bttn.first') }}</v-btn>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('prev')" small
        ><v-icon class="secondary--text" small>fas fa-angle-left</v-icon>
      </v-btn>
      <div class="page-input">
        <v-text-field v-model="pageInput" :mask="inputMask" :placeholder="newPH" :error="!valid(pageInput)" :class="validClass"></v-text-field>
      </div>
      <p class="info--text">out of {{ total }}</p>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('next')" small
        ><v-icon class="secondary--text" small>fas fa-angle-right</v-icon>
      </v-btn>
      <v-btn flat class="bttnGrey info--text text-capitalize bttn" @click="setPageOnClick('last')" small>{{ $t('bttn.last') }}</v-btn>
    </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _debounce from 'lodash.debounce'
@Component
export default class AppPaginate extends Vue {
  //@Prop(Number) total!: number

  total = 9
  page = 1
  pageInput = this.page
  validClass = 'center-input body-1 secondary--text'
  invalidClass = 'center-input body-1 error--text'

  //Methods

  valid(_page: number): boolean {
    return _page > 0 && _page <= this.total ? true : false
  }

  setPage(): void {
    if (this.valid(this.pageInput)) {
      this.page = this.pageInput
    }
  }

  setPageOnClick(_value: string): void {
    switch (_value) {
      case 'first':
        this.page = 1
        break
      case 'prev':
        if (this.valid(this.page - 1)) {
          this.page -= 1
        }
        break
      case 'next':
        if (this.valid(this.page + 1)) {
          this.page += 1
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
    const setNewPage = _debounce(this.setPage, 500)
    setNewPage()
  }

  @Watch('page')
  onPageChanged(newVal: number, oldVal: number): void {
    this.$emit('page', newVal - 1)
  }

  //Computed

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
  margin: 0
}

.page-input{
  width: 80px;
}

p {
  margin: 0;
  padding: 0;
}

</style>
