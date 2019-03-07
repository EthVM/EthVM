<template>
  <v-footer height="auto" color="white">
    <v-layout wrap row justify-space-between fill-height pa-4>
      <v-flex xs12 sm4 md2>
        <v-card flat>
          <v-card-title class="title font-weight-bold pb-4">{{ $t('footer.discover') }}</v-card-title>
          <a href="/about">
            <v-card-text class="pt-0 pb-3 black--text">{{ $t('title.about') }}</v-card-text>
          </a>
          <a href="/privacy_policy">
            <v-card-text class="pt-0 pb-3 black--text">{{ $t('footer.privPolicy') }}</v-card-text>
          </a>
          <a href="/knowledge_base">
            <v-card-text class="pt-0 pb-3 black--text">{{ $t('title.kb') }}</v-card-text>
          </a>
        </v-card>
      </v-flex>
      <v-flex xs12 sm8 md6>
        <v-card flat>
          <v-card-title class="title font-weight-bold pl-0">{{ $t('footer.donate') }}</v-card-title>
          <v-layout row wrap justify-start>
            <v-flex d-flex xs12 sm7 md6>
              <v-btn outline color="secondary" class="text-lowercase" block>
                <v-icon class="secondary--text fab fa-ethereum pr-2" />
                {{ $t('common.eth') }} - {{ $t('footer.ens') }}
              </v-btn>
            </v-flex>
            <v-flex d-flex xs12 sm5 md6>
              <v-layout reverse>
                <app-copy-to-clip :value-to-copy="ethAddr"></app-copy-to-clip>
                <v-card-text class="pl-0 secondary--text">{{ $t('footer.copyEthAddress') }}</v-card-text>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row wrap justify-start>
            <v-flex d-flex xs12 sm7 md6>
              <v-btn outline color="secondary" class="text-lowercase" block>
                <v-icon class="secondary--text fab fa-btc pr-2" />
                {{ $t('footer.btc') }} - blockchain.com
              </v-btn>
            </v-flex>
            <v-flex d-flex xs12 sm5 md6>
              <v-layout reverse>
                <app-copy-to-clip :value-to-copy="btcAddr"></app-copy-to-clip>
                <v-card-text class="pl-0 secondary--text">{{ $t('footer.copyBtcAddress') }}</v-card-text>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-layout column justify-end fill-height>
          <v-flex xs12>
            <v-layout row justify-end pt-3>
              <v-btn href="https://www.reddit.com/r/ethvm" icon> <v-icon class="fab fa-reddit grey--text"></v-icon> </v-btn>
              <v-btn href="https://twitter.com/Eth_VM" icon> <v-icon class="fab fa-twitter grey--text"></v-icon> </v-btn>
              <v-btn href="https://github.com/EthVM" icon> <v-icon class="fab fa-github grey--text"></v-icon> </v-btn>
              <v-btn href="https://medium.com/@myetherwallet" icon> <v-icon class="fab fa-medium-m grey--text"></v-icon> </v-btn>
            </v-layout>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12>
            <v-layout align-end justify-end fill-height>
              <p class="info--text">© {{ $t('footer.copy') }} {{ $t('footer.enkrypt') }}</p>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script lang="ts">
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppCopyToClip
  }
})
export default class TheFooter extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  btcAddr: string = '1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9'
  ethAddr: string = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
}
</script>
