<template>
  <v-container grid-list-lg class="mb-0">
    <v-layout row wrap justify-center mb-4>
      <h1>{{ tokensLoad }}</h1>
      <v-flex xs12>
        <!-- Table Header -->
        <v-card color="info" flat class="white--text pl-3 pr-1" height="40px" style="margin-right: 1px">
          <v-layout align-center justify-start row fill-height pr-3>
            <v-flex xs6 sm2 md3 lg2>
              <h5>{{ $t('tableHeader.token') }}</h5>
            </v-flex>
            <v-spacer />
            <v-flex hidden-sm-and-down md2>
              <h5>{{ $t('tableHeader.price') }}</h5>
            </v-flex>
            <v-flex xs6 sm3 md2>
              <h5>{{ $t('tableHeader.marketCap') }}</h5>
            </v-flex>
          </v-layout>
        </v-card>
        <!-- End Table Header -->
        <div v-for="(token, index) in tokens" :key="index">
          <transition-group name="list" tag="p">
            <v-card v-for="token in tokens" :key="token.address" class="transparent" flat>
              <v-container pa-0 ma-0>
                <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
                  <v-flex xs6 sm2 order-xs1>
                    <router-link class="black--text pb-1" :to="'/blocks'">{{ token.name }}</router-link>
                  </v-flex>
                  <v-flex xs12 sm7 md6 lass="pr-0" order-xs3 order-sm2>
                    <p class="text-truncate info--text psmall mb-0 pb-0">
                      {{ token.price.rate }}:
                    </p>
                  </v-flex>
                  <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
                    {{ token.price.marketCapUsd }}
                  </v-flex>
                </v-layout>
              </v-container>
              <v-divider class="mb-2 mt-2" />
            </v-card>
          </transition-group>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import TableTokens from '@app/modules/tokens/components/TableTokens.vue'

@Component
export default class PageTokens extends Vue {
  tokens = []

  async mounted() {
    try {
      this.tokens = await this.retrieveTokens()
    } catch (e) {
      // handle error accordingly
    }
    console.log(this.tokens)
    // this.$http.get('http://api.ethplorer.io/getTop?apiKey=freekey&criteria=cap')
    //   .then(response => {
    //     console.log(response.data)
    //     this.token
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  retrieveTokens() {
    return new Promise((resolve, reject) => {
      this.$http
        .get('http://api.ethplorer.io/getTop?apiKey=freekey&criteria=cap')
        .then(response => {
          resolve(response.data.tokens)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  get tokensLoad(): boolean {
    return this.tokens.length === 0
  }
}
</script>
