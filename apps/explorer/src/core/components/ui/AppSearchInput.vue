<template>
  <div>
    <div class="search-container">
      <div class="search-icon">
        <v-tooltip v-model="showError" top>
          <template v-slot:activator="{ showError }">
            <v-btn icon small :disabled="canSearch">
              <v-icon :class="searchClass" @click="startSearch()">search</v-icon>
            </v-btn>
          </template>
          <span>{{ errorMessage }}</span>
        </v-tooltip>
      </div>
      <input v-model="searchInput" :placeholder="searchPlaceholder" />
      <div class="clear-icon">
        <v-btn v-if="focus || !isValid" icon small>
          <v-icon :class="searchClass" @click="clear()" small>clear</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { TranslateResult } from 'vue-i18n'
import { setTimeout } from 'timers'

@Component
export default class AppSearchInput extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Boolean) isValid!: boolean
  @Prop(String) searchId!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  focus: boolean = false
  searchInput: string = ''
  showError: boolean = false

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

  // Open/close error message if !isValid
  @Watch('isValid')
  onIsValidChange(): void {
    if (!this.isValid) {
      this.showError = true
      setTimeout(() => {
        this.showError = false
      }, 10000)
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  //Notify parent for changes in the input, reset search to valid
  resetIsValid(): void {
    this.$emit('reset')
  }

  // Clear search input, reset isValid,
  clear(): void {
    this.resetIsValid()
    this.searchInput = ''
    this.showError = false
    this.focus = false
  }

  // Initiate search
  startSearch(): void {
    if (this.isValid) {
      this.$emit('search', this.searchId, this.searchInput)
    }
  }

  /*

  ===================================================================================
    Computed Values
  ===================================================================================
  */

  // Classes:  idle/in focus/invalid search for clear/search icons
  get searchClass(): string {
    if (this.isValid) {
      return this.focus ? 'primary--text' : 'info--text'
    }
    return 'txFail--text'
  }

  // Enable/disable search
  get canSearch(): boolean {
    return !this.focus || !this.isValid
  }

  // Returns placeholder text acccordign to the searchId
  get searchPlaceholder(): TranslateResult {
    return this.$t(`search.${this.searchId}.text`)
  }

  // Returns error text acccordign to the searchId
  get errorMessage(): TranslateResult {
    return this.$t(`search.${this.searchId}.error`)
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
input {
  border: 0;
  outline: 0;
}
input:focus {
  outline: none !important;
}

.search-icon {
  justify-self: start;
}
.clear-icon {
  justify-self: end;
}

.v-tooltip__content {
  border: solid 1px #fe137e;
  background-color: #ffedf5;
  color: #fe137e;
  padding: auto 1em;
}
</style>
