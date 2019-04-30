<template>
  <div>
    <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2>
      <v-flex sm3>
        <p class="info--text font-italic psmall mb-0 pb-0">
          <app-transform-hash :hash="contract.address" :link="`/tx/${contract.address}`" />
        </p>
      </v-flex>
      <v-flex sm4>
        <p class="info--text font-italic psmall mb-0 pb-0">
          <app-transform-hash :hash="contract.tx.getHash()" :link="`/tx/${contract.tx.getHash()}`" />
        </p>
      </v-flex>
      <v-flex sm1>
        <router-link class="primary--text text-truncate font-italic psmall" :to="`/block/${contract.blockNumber}`">
          {{ contract.blockNumber }}
        </router-link>
      </v-flex>
      <v-flex sm2>
        <p class="info--text font-weight-thin mb-0">{{ getTxFee(contract.tx) }}</p>
      </v-flex>
      <v-flex sm2>
        <p class="info--text font-weight-thin mb-0">
          <app-time-ago :timestamp="contract.tx.getTimestamp()" />
        </p>
      </v-flex>
    </v-layout>
    <v-divider />
  </div>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Contract, EthValue } from '@app/core/models'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'

@Component({
  components: {
    AppTimeAgo,
    AppTransformHash
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
