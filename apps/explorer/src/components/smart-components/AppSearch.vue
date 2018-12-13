<template>
  <v-layout align-center fill-height justify-end row height="48px" class="pl-1">
    <v-flex xs12 md8>
      <v-card color="transaprent" flat style="height: 48px; border: solid 1px #efefef;">
        <v-layout align-center justify-end>
          <v-text-field
            v-model="searchhash"
            v-if="phText === 'default'"
            v-on:keyup.enter="start"
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
            v-on:keyup.enter="sendReq"
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
      <v-btn
        v-if="phText === 'default'"
        @click="start"
        depressed
        color="secondary"
        class="search-button text-capitalize ml-0"
      >Search</v-btn>
      <v-btn
        v-else
        @click="sendReq"
        depressed
        outline
        class="search-button text-capitalize ml-0 primary--text lineGrey"
      >Search</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Events } from 'ethvm-common'

export default Vue.extend({
  name: 'AppSearch',
  props: {
    phText: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      searchhash: '',
      input: String
    }
  },
  methods: {
    /* Search Method : */
    start() {
      this.$socket.emit(
        Events.search,
        {
          hash: this.searchhash
        },
        (error, result) => {
          if (result) {
            switch (result.type) {
              case 0:
                {
                  this.$router.push({
                    path: '/transaction/0x' + this.searchhash
                  })
                }
                break
              case 1:
                {
                  this.$router.push({
                    path: '/address/0x' + this.searchhash
                  })
                }
                break
              case 2:
                {
                  this.$router.push({
                    path: '/block/0x' + this.searchhash
                  })
                }
                break
              case 3: {
                // search not found mess
              }
            }
          }
        }
      )
    },
    sendReq() {}
  }
})
</script>
