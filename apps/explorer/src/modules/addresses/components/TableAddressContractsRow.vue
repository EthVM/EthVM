<template>
  <v-container pa-0 ma-0>
    <v-layout d-block>
      <!--
      =====================================================================================
        Mobile (XS)
      =====================================================================================
      -->
      <v-flex xs12 hidden-sm-and-up>
        <div class="table-row-mobile">
        <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-4 pl-4">
          <v-flex xs12 pb-1>
             <app-time-ago :timestamp="contract.tx.getTimestamp()" />
          </v-flex>
          <v-flex xs12>
            <v-layout grid-list-xs row align-center justify-start fill-height class="pl-2 pr-2 pt-1 pb-1">
              <p class="info--text tx-hash "> {{$tc('contract.name', 1)}}: </p>
              <app-hash-concat :hash="contract.address" :link="`/address/${contract.address}`" :italic="true"/>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout grid-list-xs row align-center justify-start fill-height class="pl-2 pr-2 pt-1 pb-1">
              <p class="info--text tx-hash"> {{ $t('contract.created') }} {{ $tc('tx.hash', 1)}}: </p>
              <app-hash-concat :hash="contract.tx.getHash()" :link="`/tx/${contract.tx.getHash()}`" :italic="true"/>
            </v-layout>
          </v-flex>
          <v-flex xs12 pt-1>
            <p class="info--text tx-hash"> {{ $t('tx.cost') }}:
              <span class="black--text">{{ getTxFee(contract.tx) }}</span>
            </p>
          </v-flex>
        </v-layout>
        </div>
      </v-flex>
      <!--
      =====================================================================================
        Desktop (SM-LG)
      =====================================================================================
      -->
      <v-flex hidden-xs-only>
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
      </v-flex>
    </v-layout>
  </v-container>
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

.table-row-mobile {
  border: 1px solid #b4bfd2;
}

p {
  margin-bottom: 0px;
  padding-bottom: 0px;
}

.tx-status-fail {
  border-left: 2px solid #fe1377;
}

.tx-status-sucess {
  border-left: 2px solid #40ce9c;
}

.tx-self {
  color: #8391a8;
}

.tx-in {
  color: black;
}

.tx-out {
  color: #fe8778;
}

.tx-icon-type {
  padding: 0px 4px;
  background-color: #98a8c2;
  border-radius: 2px;
  color: white;
  text-transform: uppercase;
  font-size: 10px;
  height: 16px;
  margin: 0px;
}

.p-row{
  display:inline;
}
</style>
