import {SearchType} from "../../api/apollo/types/globalTypes";
<template>
  <v-layout align-center fill-height justify-end row height="48px" class="pl-1">
    <v-flex xs12 md8>
      <v-card flat style="height: 48px; border: solid 1px #efefef;">
        <v-layout align-center justify-end>
          <v-text-field
            v-model="searchInput"
            v-if="phText === 'default'"
            @keyup.enter="onSearch"
            :placeholder="$t('search.default')"
            color="primary"
            solo
            flat
            clearable
            spellcheck="false"
            :prepend-inner-icon="getIcon"
            class="ma-0"
            height="46px"
            @click:clear="resetValues"
          />
          <v-text-field
            dense
            v-if="phText === 'addressTxSearch'"
            @keyup.enter="onSearch"
            flat
            :placeholder="$t('search.address-tx')"
            color="primary"
            solo
            clearable
            spellcheck="false"
            prepend-inner-icon="fa fa-search grey--text text--lighten-1 pr-4 pl-4"
            class="ma-0"
            height="34px"
          />
        </v-layout>
      </v-card>
    </v-flex>
    <v-flex hidden-sm-and-down md4 style="max-width: 115px;">
      <v-btn v-if="phText === 'default'" @click="onSearch" depressed color="secondary" class="search-button text-capitalize ml-0">{{
        $t('search.name')
      }}</v-btn>
      <v-btn v-else @click="onSearch" depressed outline class="search-button text-capitalize ml-0 primary--text lineGrey">{{ $t('search.name') }}</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { search } from '@app/core/components/ui/search.graphql'
import { SearchResultExt } from '@app/core/api/apollo/extensions/search-result.ext'
import { SearchType } from '@app/core/api/apollo/types/globalTypes'

@Component({
  data() {
    return {
      query: undefined
    }
  },
  apollo: {
    search: {
      query: search,
      variables() {
        return {
          query: this.query
        }
      },
      manual: true,
      result({ data, loading }) {
        if (!loading && data.search) {
          const self = this as any
          self.processSearchResult(new SearchResultExt(data.search))
        }
      },
      skip() {
        return !this.query
      }
    }
  }
})
export default class AppSearch extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  searchInput = ''
  phText = 'default'
  isValid = true

  query?: string

  /*
  ===================================================================================
    Watch
  ===================================================================================
  */

  @Watch('searchInput')
  onSearchInputChange(newVal: string, oldVal: string): void {
    if (newVal === null || newVal === '') {
      this.resetValues()
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  onSearch() {
    this.query = this.searchInput
    this.$apollo.queries.search.refetch()
  }

  processSearchResult(result: SearchResultExt) {
    if (!result.type || result.type === SearchType.None) {
      this.isValid = false
      return
    }

    this.isValid = true
    this.$router.push({ path: `/${result.type}/` + (this.searchInput.startsWith('0x') ? this.searchInput : `0x${this.searchInput}`) })
    this.searchInput = ''
    this.query = undefined
  }

  resetValues(): void {
    this.isValid = true
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get getIcon(): string {
    return this.isValid ? 'fa fa-search grey--text text--lighten-1 pr-4 pl-4' : 'fa fa-search error--text pr-4 pl-4'
  }
}
</script>
