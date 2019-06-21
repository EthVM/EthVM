<template>
  <div class="search-container">
      <!-- Search Icon/button when in focus -->
      <div class="search-icon">
      <v-btn icon small :disabled="canSearch">
        <v-icon :class="searchClass" @click="startSearch()">search</v-icon>
      </v-btn>
      </div>
      <input v-model="searchInput" :placeholder="searchPlaceholder" class="search-tx-input" @keyup.enter="startSearch()">

      <div class="clear-icon" >
        <v-btn v-if="focus || !isValid" icon small>
          <v-icon :class="searchClass" @click="clear()">clear</v-icon>
        </v-btn>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { TranslateResult } from 'vue-i18n'


@Component
export default class AppSearchInput extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Boolean) isValid!: boolean
  @Prop(String) searchID!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  focus: boolean = false
  searchInput: string = ''

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  @Watch('searchInput')
  onSearchInputChange(newVal: string, oldVal: string): void {
    if (newVal === null || newVal === '') {
      this.resetIsValid()
    } else {
      this.focus = true
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  //Notify parent for changes in the input, reset search to valid
  resetIsValid(): void {
    this.focus = false
    this.$emit('reset')
  }

  //Clear search input, reset isValid
  clear(): void {
    this.searchInput = ''
    this.resetIsValid()
  }

  startSearch(): void {
    console.log("emiting search")
    if (this.isValid) {
      this.$emit('search', this.searchID, this.searchInput)
    }
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * if Search has failed return false
   */

  get searchClass(): string {
    if (this.isValid) {
      return this.focus ? 'primary--text' : 'info--text'
    }
    return 'txFail--text'
  }

  get canSearch(): boolean {
    return !this.focus || !this.isValid
  }

  get searchPlaceholder(): TranslateResult {
    return this.$t(`search.${this.searchID}`)
  }
}
</script>


<style scoped lang="css">
.search-container {
  display: grid;
  grid-template-columns: 40px auto 40px;
  border: solid 1px #b4bfd2;
}
.search-tx-input {
  width: 100%;
  padding: 0px 0.5em;
}
 input {border:0;outline:0;}
  input:focus {outline:none!important;}

.search-icon{
  justify-self: start;
}
.clear-icon{
  justify-self: end;
}

</style>
