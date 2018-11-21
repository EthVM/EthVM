<template>
  <v-card color="white" flat :class="{'pa-1': $vuetify.breakpoint.xsOnly, 'pa-3': $vuetify.breakpoint.smOnly,'pa-5': $vuetify.breakpoint.mdAndUp}">
    <v-layout wrap grid-list-sm align-center column fill-height pa-2>
      <v-flex xs12>
        <v-card-title class="display-1 font-weight-bold pb-1 ">What is EthVM?</v-card-title>
        <v-card-text> EthVM project is brought to you by kvhnuke, founder of MyEtherWallet and enKrypt. EthVM is a free and open source interface for exploring and evaluting real time Ethereum blocks, transactions and more. This software is under MIT License.
        </v-card-text>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap justify-start>
          <v-flex xs12 sm6 md3>
            <v-card-actions><v-icon class="primary--text pl-2" large>fab fa-github</v-icon></v-card-actions>
            <v-card-title class="title pb-1">GitHub</v-card-title>
            <v-card-text>If you want to contribute, make a request on GitHub.</v-card-text>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card-actions><v-icon class="primary--text  pl-2" large>fab fa-medium-m</v-icon></v-card-actions>
            <v-card-title class="title pb-1">Medium</v-card-title>
            <v-card-text>If you want to listen/share our awesome thoughts check our medium account.</v-card-text>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card-actions><v-icon class="primary--text  pl-2" large>fab fa-twitter</v-icon></v-card-actions>
            <v-card-title class="title pb-1">Twitter</v-card-title>
            <v-card-text>Talk to us on Twitter.</v-card-text>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card-actions><v-icon class="primary--text  pl-2" large>fab fa-reddit</v-icon></v-card-actions>
            <v-card-title class="title pb-1">Reddit</v-card-title>
            <v-card-text>Visit our reddit thread.</v-card-text>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-card-title class="display-1 font-weight-bold">Disclaimer</v-card-title>
        <v-card-text> MIT License Copyright © 2017-2018 enKrypt LLC Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright
          notice and this permission notice shall be included in all copies or substantial portions of the Software.</v-card-text>
        <v-card-text> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
          HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</v-card-text>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'about',
  data() {
    return {}
  }
})
</script>
