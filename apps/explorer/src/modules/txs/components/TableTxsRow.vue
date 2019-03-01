<template>
  <v-container pa-0 ma-0>
    <v-layout v-if="txs" grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
      <!--
      =====================================================================================
          BLOCK NUMBER / HASH

          Responsive Tally:
          XS: 3/12 (3)
          SM: 3/12 (3)
          MD: 1/12 (1)
      =====================================================================================
      -->
      <v-flex xs3 sm3 md1 pr-1>
        <router-link class="primary--text text-truncate font-italic psmall" :to="'/block/' + tx.getBlockHash()">{{ tx.getBlockNumber() }}</router-link>
      </v-flex>
      <!--
      =====================================================================================
        TRANSACTION # / HASH

        Responsive Tally:
        XS: 10/12 (7)
        SM: 9/12 (6)
        MD: 7/12 (6)
      =====================================================================================
      -->
      <v-flex d-flex xs7 sm6 md6 pr-3>
        <v-layout row wrap align-center pb-1>
          <v-flex d-flex xs12 pb-2>
            <router-link class="primary--text text-truncate font-italic psmall" :to="'/tx/' + tx.getHash()">{{ tx.getHash() }}</router-link>
          </v-flex>
          <v-flex xs12 pt-0>
            <v-layout row pl-2>
              <p class="text-truncate info--text mb-0">
                {{ $t('tx.from') }}:
                <router-link :to="'/address/' + tx.getFrom().toString()" class="secondary--text font-italic font-weight-regular">{{
                  tx.getFrom().toString()
                }}</router-link>
              </p>
              <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
              <p class="text-truncate info--text font-weight-thin mb-0" v-if="!tx.getContractAddress().isEmpty()">
                {{ $t('tx.contract') }}:
                <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getContractAddress().toString()">{{
                  tx.getContractAddress().toString()
                }}</router-link>
              </p>
              <p class="text-truncate info--text font-weight-thin mb-0" v-else>
                <strong>{{ $t('tx.to') }}:</strong>
                <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getTo().toString()">{{
                  tx.getTo().toString()
                }}</router-link>
              </p>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <!--
      =====================================================================================
        ETH VALUE

        Responsive Tally:
        XS: 12/12 (2)
        SM: 11/12 (2)
        MD: 8/12 (1)
      =====================================================================================
      -->
      <v-flex d-flex xs2 sm2 md1 pr-0>
        <p v-if="$vuetify.breakpoint.xsOnly" class="text-truncate info--text">Amount:</p>
        <p :class="[tx.getStatus() ? 'txSuccess--text mb-0' : 'txFail--text mb-0']">
          <v-tooltip v-if="isShortValue(tx.getValue().toEth())" bottom>
            <template #activator="data">
              <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
            </template>
            <span>{{ tx.getValue().toEth() }}</span>
          </v-tooltip>
          {{
            getShortValue(
              tx
                .getValue()
                .toEth()
                .toString()
            )
          }}
        </p>
      </v-flex>
      <!--
      =====================================================================================
        GAS

        Responsive Tally:
        XS: 12/12 (0)
        SM: 11/12 (0)
        MD: 9/12 (1)
      =====================================================================================
      -->
      <v-flex hidden-sm-and-down md1>
        <p class="black--text text-truncate mb-0">{{ tx.getGas().toNumber() }}</p>
      </v-flex>
      <!--
      =====================================================================================
        GWEI

        Responsive Tally:
        XS: 12/12 (0)
        SM: 11/12 (0)
        MD: 11/12 (2)
      =====================================================================================
      -->
      <v-flex hidden-sm-and-down md2>
        <p class="text-truncate black--text mb-0">{{ tx.getGasPrice().toGWei() }}</p>
      </v-flex>
      <!--
      =====================================================================================
        STATUS

        Responsive Tally:
        XS: 12/12 (0)
        SM: 12/12 (1)
        MD: 12/12 (1)
      =====================================================================================
      -->
      <v-flex hidden-xs-only v-if="!isPending" sm1>
        <v-icon v-if="tx.getStatus()" small class="txSuccess--text">fa fa-check-circle</v-icon>
        <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
      </v-flex>
      <v-flex v-else hidden-xs-and-up></v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { Tx, SimpleTx } from '@app/core/models'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'

@Component
export default class TableTxsRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) tx!: Tx | SimpleTx
  @Prop({ type: Boolean, default: false }) isPending

  get txs(){
    console.log(this.tx)
    return true
  }
}
</script>
