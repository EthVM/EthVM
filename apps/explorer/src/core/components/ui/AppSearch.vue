<template>
  <v-layout align-center fill-height justify-end row height="48px" class="pl-1">
    <v-flex xs12 md8>
      <v-card color="transaprent" flat style="height: 48px; border: solid 1px #efefef;">
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
            prepend-inner-icon="fa fa-search grey--text text--lighten-1 pr-4 pl-4"
            class="ma-0"
            height="46px"
          ></v-text-field>
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
          ></v-text-field>
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
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: {
    phText: {
      type: String,
      default: 'default'
    }
  }
})
export default class AppSearch extends Vue {
  searchInput = ''
  input = ''

  // Methods
  search() {
    this.$api.search(this.searchInput).then(res => {
      switch (res.type) {
        case 0:
          {
            this.$router.push({
              path: '/tx/0x' + this.searchInput
            })
          }
          break
        case 1:
          {
            this.$router.push({
              path: '/address/0x' + this.searchInput
            })
          }
          break
        case 2:
          {
            this.$router.push({
              path: '/block/0x' + this.searchInput
            })
          }
          break
        case 3: {
          // search not found mess
        }
      }
    })
  }
}
</script>
