<template>
  <div>
    <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2>
      <v-flex sm3>
        <p class="primary--text text-truncate font-italic psmall mb-0 pb-0">{{ contract.address }}</p>
      </v-flex>
      <v-flex sm3>
        <p class="info--text font-weight-thin mb-0">TODO!</p>
      </v-flex>
      <v-flex sm2>
        <p class="info--text font-weight-thin mb-0">{{ contract.blockNumber }}</p>
      </v-flex>
      <v-flex sm2>
        <p class="info--text font-weight-thin mb-0">TODO!</p>
      </v-flex>
      <v-flex sm2>
        <p class="info--text font-weight-thin mb-0">TODO!</p>
      </v-flex>
    </v-layout>
    <v-divider />
  </div>
</template>

<script lang="ts">
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Contract } from "@app/core/models";

@Component
export default class TableAddressContractsRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) contract!: Contract

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
