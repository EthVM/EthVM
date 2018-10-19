<template>
  <v-footer height="auto">
    <v-card class="flex blue-grey darken-4" flat tile>
      <v-card class="text-xs-center justify-content white--text primary" flat tile>
        <v-btn href="https://www.facebook.com/enKryptIO/" icon>
          <v-icon class="fab fa-facebook-f white--text"></v-icon>
        </v-btn>
        <v-btn href="https://twitter.com/enkryptio" icon>
          <v-icon class="fab fa-twitter white--text"></v-icon>
        </v-btn>
        <v-btn href="https://github.com/enKryptIO" icon>
          <v-icon class="fab fa-github white--text"></v-icon>
        </v-btn>
        <v-btn href="https://github.com/enKryptIO" icon>
          <v-icon class="fab fa-medium-m white--text"></v-icon>
        </v-btn>
      </v-card>
        <v-layout row wrap justify-space-between>
          <v-flex sm12 md4>
            <v-card color="transparent" class="white--text" flat>
              <div><strong>{{ $t( 'title.about' ) }}</strong></div>
              <div>{{ $t( 'footer.aboutPar' ) }}</div>
            </v-card>
          </v-flex>

          <v-flex sm12 md4>
            <v-card color="transparent" class="white--text" flat>
              <div><strong>{{ $t( 'footer.donate' ) }}</strong></div>
              <div>{{ $t( 'common.eth' ) }}: {{ $t( 'footer.ens' ) }} <a href="https://etherscan.io/address/0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D">0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D</a></div>
              <div>{{ $t( 'footer.btc' ) }}: <a href="https://blockchain.info/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9">1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9</a></div>
            </v-card>
          </v-flex>
        </v-layout>

      <v-divider class="blue-grey darken-3"></v-divider>
      <v-card color="transparent" class=" text-xs-center white--text" flat>
        <v-card-text class="white--text">© {{ $t( 'footer.copy' ) }}<a href="/about" class="text-white">{{ $t( 'footer.enkrypt' ) }}</a></v-card-text>
      </v-card>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import VFooter from 'vuetify'
export default Vue.extend()
</script>
