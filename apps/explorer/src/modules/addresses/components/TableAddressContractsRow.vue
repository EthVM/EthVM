<template>
  <div>
    <v-layout grid-list-lg row wrap align-center justify-start fill-height pa-3>
        <v-flex sm4 class="pr-5">
          <app-hash-concat :hash="contract.address" :link="`/address/${contract.address}`" :italic="true"/>
        </v-flex>
        <v-flex sm4>
          <v-layout row  class="pl-1 pr-5">
            <p class="info--text tx-hash pl-2">{{ $tc('tx.hash', 1)}}: </p>
            <app-hash-concat :hash="contract.tx.getHash()" :link="`/tx/${contract.tx.getHash()}`" :italic="true"/>
          </v-layout>
        </v-flex>
        <v-flex sm2>
          <app-time-ago :timestamp="contract.tx.getTimestamp()" />
        </v-flex>
        <v-flex sm2>
         {{ getTxFee(contract.tx) }}
        </v-flex>
    </v-layout>
    <v-divider />
  </div>
</template>

<script lang="ts">
import BN from 'bignumber.js'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Contract, EthValue } from '@app/core/models'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppHashConcat from '@app/core/components/ui/AppHashConcat.vue'

@Component({
  components: {
    AppTimeAgo,
    AppHashConcat
  }
})
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

  getTxFee(tx): string {
    return this.getRoundNumber(new EthValue(tx.getGasPrice() * tx.getGasUsed()).toEth())
  }
}
</script>

<style scoped lang="css">
  .tx-hash{
    padding-bottom: 0px;
    margin-bottom: 0px;
    min-width: fit-content;
    padding-right: 5px;
  }
</style>

