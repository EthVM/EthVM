<template>
  <v-card color="white" flat>
    <v-layout grid-list-md align-start justify-start row fill-height :class="layoutPadding">
      <v-flex shrink>
        <v-layout align-start justify-center row fill-height pa-2>
          <blockies :address="account.address" />
        </v-layout>
      </v-flex>
      <v-flex d-block>
        <v-layout wrap column fill-height pa-1>
          <v-flex xs12>
            <v-layout row wrap align-center justify-space-between>
              <v-card-title class="title font-weight-bold pl-1 pr-3 pb-2 ">{{ title }}</v-card-title>
              <v-layout hidden-xs-only align-center justify-start row fill-height pt-2>
                <div v-if="!account.isContract && account.isMiner" class="chip miner-chip mr-2 ml-1">{{ $t('miner.name') }}</div>
                <div v-if="!account.isContract && account.isCreator" class="chip creator-chip">{{ $t('contract.creator') }}</div>
              </v-layout>
              <address-qr :address="account.address" :large="true" />
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout row align-center justify-start>
              <app-copy-to-clip :value-to-copy="account.address" />
              <p class="break-hash font-mono pt-0 pr-4 pl-1">{{ account.address }}</p>
            </v-layout>
          </v-flex>
          <v-flex xs12 hidden-sm-and-up v-if="hasChips">
            <v-layout align-center justify-start row fill-height pt-2>
              <div v-if="!account.isContract && account.isMiner" class="chip miner-chip mr-2 ml-1">{{ $t('miner.name') }}</div>
              <div v-if="!account.isContract && account.isCreator" class="chip creator-chip">{{ $t('contract.creator') }}</div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- <v-flex hidden-xs-only fill-height mr-3>
        <v-layout justify-end> <address-qr :address="account.address" :large="true" /> </v-layout>
      </v-flex> -->
    </v-layout>

    <!--
    =====================================================================================
      BLOCKS
    =====================================================================================
    -->
    <v-layout>
      <v-flex hidden-xs-only>
        <v-layout row wrap justify-space-between :class="layoutPadding">
          <!-- Ether Balance -->
          <v-flex xs12 md4>
            <v-card class="primary white--text pl-2" flat>
              <v-card-text class="pb-0">{{ $t('common.eth-balance') }}</v-card-text>
              <!-- isShortValue -->
              <v-card-title v-if="!isShortValue(account.balanceEth.toString())" class="headline text-truncate pr-1"
                >{{ getShortValue(account.balanceEth) }} {{ $t('common.eth') }}
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-icon v-on="data.on" small class="white--text text-xs-center pl-1">fa fa-question-circle</v-icon>
                  </template>
                  <span>{{ formatStr(account.balanceEth.toString()) }} {{ $t('common.eth') }}</span>
                </v-tooltip>
              </v-card-title>
              <!-- !isShortValue -->
              <v-card-title v-else class="headline text-truncate">{{ account.balanceEth }} {{ $t('common.eth') }}</v-card-title>
            </v-card>
          </v-flex>
          <!-- End Ether Balance -->
          <!-- USD Value -->
          <v-flex xs12 md4>
            <v-card class="error white--text pl-2" flat>
              <v-card-text class="pb-0">{{ $t('usd.value') }} (1{{ $t('common.eth') }} = ${{ getRoundNumber(exchangeRatePrice) }})</v-card-text>
              <v-card-title class="headline text-truncate">${{ getRoundNumber(account.balanceEth * exchangeRatePrice) }}</v-card-title>
            </v-card>
          </v-flex>
          <!-- End USD Value -->
          <!-- Number of TX -->
          <v-flex xs12 md4>
            <v-card class="warning white--text pl-2" flat>
              <v-card-text class="pb-0">{{ $t('tx.total') }}</v-card-text>
              <v-card-title class="headline text-truncate">{{ account.totalTxCountBN.toString() }}</v-card-title>
            </v-card>
          </v-flex>
          <!-- End Number of Tx -->
        </v-layout>
      </v-flex>
      <v-flex hidden-sm-and-up pt-0>
        <div class="xs-overflow">
          <v-card class="primary xs-div white--text ">
            <v-card-text class="pb-0">{{ $t('common.eth-balance') }}</v-card-text>
            <!-- isShortValue -->
            <v-card-title v-if="!isShortValue(account.balanceEth.toString())" class="headline text-truncate pr-1"
              >{{ getShortValue(account.balanceEth) }} {{ $t('common.eth') }}
              <v-tooltip bottom>
                <template #activator="data">
                  <v-icon v-on="data.on" small class="white--text text-xs-center pl-1">fa fa-question-circle</v-icon>
                </template>
                <span>{{ formatStr(account.balanceEth.toString()) }} {{ $t('common.eth') }}</span>
              </v-tooltip>
            </v-card-title>
            <!-- !isShortValue -->
            <v-card-title v-else class="headline text-truncate">{{ account.balanceEth }} {{ $t('common.eth') }}</v-card-title>
          </v-card>

          <v-card class="error white--text xs-div " flat>
            <v-card-text class="pb-0">{{ $t('usd.value') }} (1{{ $t('common.eth') }} = ${{ getRoundNumber(exchangeRatePrice) }})</v-card-text>
            <v-card-title class="headline text-truncate">${{ getRoundNumber(account.balanceEth * exchangeRatePrice) }}</v-card-title>
          </v-card>

          <v-card class="warning white--text xs-div" flat>
            <v-card-text class="pb-0">{{ $t('tx.total') }}</v-card-text>
            <v-card-title class="headline text-truncate">{{ account.totalTxCountBN.toString() }}</v-card-title>
          </v-card>

          <div class="empty-xs"></div>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import AddressQr from '@app/modules/addresses/components/AddressQr.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import Blockies from '@app/modules/addresses/components/Blockies.vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { exchangeRate } from '@app/modules/addresses/addresses.graphql'
import { AccountExt } from '@app/core/api/apollo/extensions/account.ext'

@Component({
  components: {
    AddressQr,
    AppCopyToClip,
    Blockies
  },
  apollo: {
    exchangeRatePrice: {
      query: exchangeRate,
      update({ exchangeRate }) {
        // TODO handle no exchange rate data case
        return exchangeRate ? exchangeRate.price : 0
      }
    }
  }
})
export default class AddressDetail extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) account!: AccountExt
  @Prop(String!) address!: string

  exchangeRatePrice = 0

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get title(): string {
    return this.account.isContract ? this.$i18n.tc('contract.name', 1) : this.$i18n.tc('address.name', 1)
  }

  get hasChips(): boolean {
    return !this.account.isContract && (this.account.isMiner || this.account.isContractCreator)
  }

  get layoutPadding(): string {
    const brkPoint = this.$vuetify.breakpoint.name

    switch (brkPoint) {
      case 'xs':
        return 'pa-2'
      default:
        return 'pa-3'
    }
  }
}
</script>

<style scoped lang="css">

.break-hash{
  word-break: break-all;
}

.chip {
  height: 28px;
  border-radius: 14px;
  font-size: 85%;
  color: white;
  padding: 5px 10px;
}

.miner-chip{
  background-color: #40ce9c;
}

.creator-chip {
  background-color: #b3d4fc;
}

p {
  margin-bottom: 0px;
}


.xs-overflow{
  display: flex;
  overflow-x: scroll;
  margin: 8px;
}

.xs-div{
  min-width: 75vw;
  margin-right: 10px;
}

.empty-xs {
  min-width: 10vw;
}
.xs-overflow:after {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 120px;
  width: 12vw;
  content: "";
  background: linear-gradient(to left,
     rgba(255,255,255, 1) 5%,
     hsla(0, 0%, 100%, 0) 80%
  );
}
</style>
