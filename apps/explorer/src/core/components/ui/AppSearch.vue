<template>
  <v-layout align-center fill-height justify-end row height="48px" class="pl-1">
    <v-flex xs12 md8>
      <v-card flat style="height: 48px; border: solid 1px #efefef;">
        <v-layout align-center justify-end>
          <v-text-field
            v-model="searchInput"
            v-if="phText === 'default'"
            @keyup.enter="search"
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
            @keyup.enter="search"
            flat
            :placeholder="$t('search.addressTx')"
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
      <v-btn v-if="phText === 'default'" @click="search" depressed color="secondary" class="search-button text-capitalize ml-0">{{ $t('search.title') }}</v-btn>
      <v-btn v-else @click="search" depressed outline class="search-button text-capitalize ml-0 primary--text lineGrey">{{ $t('search.title') }}</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class AppSearch extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  searchInput = ''
  phText = 'default'
  isValid = true

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

  search() {
    this.$api.search(this.searchInput).then(res => {
      if (res.type != 3) {
        this.isValid = true
      }
      switch (res.type) {
        case 0:
          {
            this.$router.push({
              path: '/tx/' + this.searchInput
            })
          }
          break
        case 1:
          {
            this.$router.push({
              path: '/address/' + this.searchInput
            })
          }
          break
        case 2:
          {
            this.$router.push({
              path: '/block/' + this.searchInput
            })
          }
          break
        case 3: {
          this.isValid = false
        }
      }
    })
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
