<template>
  <v-footer height="auto" color="white">
    <v-layout wrap row justify-space-between fill-height>
      <!--
      =====================================================================================
        Discover

        Responsive Tally:
        XS:12/12 (12)
        SM: 3/12 (3)
        MD: 3/12 (3)
      =====================================================================================
      -->
      <v-flex xs12 sm3 :class="flexClass">
        <v-card flat>
          <v-layout row pa-0 align-center>
            <v-card-title class="title font-weight-bold pb-4">{{ $t('footer.discover') }}</v-card-title>
            <v-flex hidden-sm-and-up pa-0>
              <app-language />
            </v-flex>
          </v-layout>
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
      <!--
      =====================================================================================
        Donate

        Responsive Tally:
        XS:24/12 (12)
        SM: 12/12 (9)
        MD: 8/12 (5)
      =====================================================================================
      -->
      <v-flex xs12 sm9 md5 :class="flexClass">
        <v-card flat>
          <v-layout row pa-0 align-center>
            <v-card-title class="title font-weight-bold pb-4">{{ $t('footer.donate') }}</v-card-title>
            <v-flex hidden-xs-only hidden-md-and-up pa-0>
              <app-language />
            </v-flex>
          </v-layout>
          <v-layout row wrap justify-start>
            <v-btn outline color="secondary" class="text-lowercase font-weight-regular donation-btn" :to="'/address/' + ethAddr">
              <v-icon class="secondary--text fab fa-ethereum pr-2" />
              {{ $t('common.eth') }} - {{ $t('footer.ens') }}
            </v-btn>
            <v-layout reverse>
              <app-copy-to-clip :value-to-copy="ethAddr"></app-copy-to-clip>
              <v-card-text class="pl-0 secondary--text">{{ $t('footer.copyEthAddress') }}</v-card-text>
            </v-layout>
          </v-layout>
          <v-layout row wrap justify-start>
            <v-btn
              outline
              color="secondary"
              class="text-lowercase font-weight-regular donation-btn"
              href="https://www.blockchain.com/btc/address/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
            >
              <v-icon class="secondary--text fab fa-btc pr-2" />
              {{ $t('footer.btc') }} - blockchain.com
            </v-btn>
            <v-layout reverse>
              <app-copy-to-clip :value-to-copy="btcAddr"></app-copy-to-clip>
              <v-card-text class="pl-0 secondary--text">{{ $t('footer.copyBtcAddress') }}</v-card-text>
            </v-layout>
          </v-layout>
        </v-card>
      </v-flex>
      <!--
      =====================================================================================
        Donate

        Responsive Tally:
        XS:36/12 (12)
        SM: 24/12 (12)
        MD: 14/12 (4)
      =====================================================================================
      -->
      <v-flex xs12 md4 :class="flexClass">
        <v-layout column justify-end fill-height>
          <v-flex hidden-sm-and-down xs12>
            <app-language />
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12>
            <v-layout row justify-end align-end fill-height>
              <v-btn href="https://www.reddit.com/r/ethvm" icon> <v-icon class="fab fa-reddit grey--text"></v-icon> </v-btn>
              <v-btn href="https://twitter.com/Eth_VM" icon> <v-icon class="fab fa-twitter grey--text"></v-icon> </v-btn>
              <v-btn href="https://github.com/EthVM" icon> <v-icon class="fab fa-github grey--text"></v-icon> </v-btn>
              <v-btn href="https://medium.com/@myetherwallet" icon> <v-icon class="fab fa-medium-m grey--text"></v-icon> </v-btn>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout align-end justify-end fill-height>
              <p class="info--text text-xs-right">© {{ $t('footer.copy') }} {{ $t('footer.mew') }}</p>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script lang="ts">
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import AppLanguage from '@app/core/components/ui/AppLanguage.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppCopyToClip,
    AppLanguage
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

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */
  get flexClass(): string {
    return this.$vuetify.breakpoint.name === 'sm' || this.$vuetify.breakpoint.name === 'xs' ? 'pa-1' : 'pa-3'
  }
}
</script>

<style scoped lang="css">
.donation-btn {
  width: 200px;
}
</style>
