<template>
  <v-layout align-center fill-height justify-end row height="48px" class="pl-1">
    <div  style="height: 48px; min-width: 200px; max-width: 380px; border: solid 1px #efefef;">
      <v-layout align-center justify-end>
      <v-text-field v-if="phText === 'default'"  v-on:keyup.enter="start" :placeholder="$t('search.default')" color="primary"  solo flat clearable spellcheck="false" prepend-inner-icon="fa fa-search grey--text text--lighten-1 pr-4 pl-4" class="ma-0" height="46px"></v-text-field>
      <v-text-field v-if="phText === 'addressTxSearch'"  v-on:keyup.enter="start" flat  :placeholder="$t('search.addressTx')" color="primary"  solo flat clearable spellcheck="false" prepend-inner-icon="fa fa-search grey--text text--lighten-1 pr-4 pl-4" class="ma-0" height="46px"></v-text-field>
      </v-layout>
    </div>
    <v-flex hidden-sm-and-down style="max-width: 115px;">
      <v-btn @click="start" depressed color="secondary" class="search-button text-capitalize ml-0">Search</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Search',
  props: {
    phText: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      search: 'Hello',
      input: String
    }
  },
  methods: {
    /* Search Method : */
    start() {
      console.log('searching')
    }
  }
})
</script>

