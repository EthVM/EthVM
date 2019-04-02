<template>
  <router-link :to="tokenLink" v-if="token.balance != 0">
    <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2>
      <v-flex xs6 sm2>
        <p class="primary--text text-truncate font-italic psmall mb-0 pb-0">{{ token.symbol }}</p>
      </v-flex>
      <v-flex hidden-xs-only sm4 md3>
        <p class="info--text font-weight-thin mb-0">{{ token.name }}</p>
      </v-flex>
      <v-flex xs6 sm3 md4>
        <p class="info--text font-weight-thin mb-0">{{ balance(token.balance, token.decimals) }}</p>
      </v-flex>
      <v-flex hidden-xs-only sm3>
        <p class="info--text font-weight-thin mb-0">
          <v-tooltip v-if="!isShortValue(getRoundNumberUnformatted(balance(token.balance, token.decimals) * token.currentPrice), 5)" bottom>
            <template #activator="data">
              <v-icon v-on="data.on" small class="info--text text-xs-center">fa fa-question-circle</v-icon>
            </template>
            <span
              >${{ getShortValue(getRoundNumberUnformatted(balance(token.balance, token.decimals) * token.currentPrice), 5) }} (@ ${{
                getRoundNumber(token.currentPrice)
              }}
              per {{ token.symbol }})</span
            >
          </v-tooltip>
          {{ getShortValue(getRoundNumberUnformatted(balance(token.balance, token.decimals) * token.currentPrice)) }} (@ ${{
            getRoundNumber(token.currentPrice)
          }}
          per {{ token.symbol }})
        </p>
      </v-flex>
    </v-layout>
    <v-divider />
  </router-link>
</template>

<script lang="ts">
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component
export default class TableAddressTokensRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) token!: any
  @Prop(String) holder!: string

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  balance(value, decimals) {
    const n = new BN(value)
    return n
      .div(new BN(10).pow(decimals))
      .toFixed()
      .toString()
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get tokenLink(): string {
    return `/token/${this.token.addr}?holder=${this.holder}`
  }
}
</script>
