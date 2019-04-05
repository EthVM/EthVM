<template>
  <v-container pa-0 ma-0>
    <v-layout d-block>
      <!--
      =====================================================================================
        Mobile (XS)
      =====================================================================================
      -->
      <v-flex xs12 hidden-sm-and-up>
        <div :class="txStatusClass">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
            <v-flex xs6 pa-1>
              <router-link class="black--text font-weight-medium pb-1" :to="'/block/' + tx.getBlockHash()"
                >{{ $t('block.number') }} {{ tx.getBlockNumber() }}</router-link
              >
            </v-flex>
            <v-flex xs6 pr-44>
              <v-layout row justify-end>
                <app-time-ago :timestamp="tx.getTimestamp()" />
              </v-layout>
            </v-flex>
            <v-flex xs2 pa-1>
              <p class="info--text psmall">{{ $tc('tx.hash', 1) }}:</p>
            </v-flex>
            <v-flex xs10 pa-1>
              <app-hash-concat :hash="tx.getHash()" :link="'/tx/' + tx.getHash()" />
            </v-flex>
            <v-flex xs12 pa-1>
              <v-layout row pa-2>
                <p class="info--text psmall pr-1">{{ $tc('address.name', 2) }}:</p>
                <app-hash-concat :hash="tx.getFrom().toString()" :italic="true" :link="'/address/' + tx.getFrom().toString()" />
                <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                <app-hash-concat
                  v-if="!tx.getContractAddress().isEmpty()"
                  :hash="tx.getContractAddress().toString()"
                  :italic="true"
                  :link="'/address/' + tx.getContractAddress().toString()"
                />
                <app-hash-concat v-else :hash="tx.getTo().toString()" :italic="true" :link="'/address/' + tx.getTo().toString()" />
              </v-layout>
            </v-flex>
            <v-flex shrink pa-1>
              <p class="info--text psmall">{{ $t('common.eth') }}:</p>
            </v-flex>
            <v-flex shrink pa-1>
              <p class="black--text align-center">{{ getRoundNumber(tx.getValue().toEth()) }}</p>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <!--
      =====================================================================================
        Tablet/ Desktop (SM - XL)
      =====================================================================================
      -->
      <v-flex hidden-xs-only sm12>
        <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
          <!--
          =====================================================================================
            BLOCK NUMBER / HASH

            Responsive Tally:
            SM: 2/12 (2)
            MD: 1/12 (1)
          =====================================================================================
          -->
          <v-flex sm2 md1 pr-1>
            <router-link class="primary--text text-truncate font-italic psmall" :to="'/block/' + tx.getBlockHash()">{{ tx.getBlockNumber() }}</router-link>
          </v-flex>
          <!--
          =====================================================================================
            TRANSACTION # / HASH

            Responsive Tally:
            SM: 9/12 (7)
            MD: 7/12 (6)
          =====================================================================================
          -->
          <v-flex d-flex sm7 md6 pr-3>
            <v-layout row wrap align-center pb-1>
              <v-flex sm12 pa-2>
                <v-layout row align-center justift-start pa-1>
                  <v-flex shrink pa-1>
                    <p class="info--text psmall">{{ $tc('tx.hash', 1) }}:</p>
                  </v-flex>
                  <v-flex sm10 lg11 pa-1>
                    <app-hash-concat :hash="tx.getHash()" :link="'/tx/' + tx.getHash()" />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex sm12 pa-2>
                <v-layout row align-center justify-space-around fill-height pa-2>
                  <p class="info--text mb-0 mr-1">{{ $t('tx.from') }}:</p>
                  <app-hash-concat :hash="tx.getFrom().toString()" :link="'/address/' + tx.getFrom().toString()" :italic="true" />
                  <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2" small></v-icon>
                  <p class="info--text mb-0 mr-1" v-if="!tx.getContractAddress().isEmpty()">{{ $tc('contract.name', 1) }}:</p>
                  <p class="info--text mb-0 mr-1" v-else>{{ $t('tx.to') }}:</p>
                  <app-hash-concat
                    v-if="!tx.getContractAddress().isEmpty()"
                    :hash="tx.getContractAddress().toString()"
                    :link="'/address/' + tx.getContractAddress().toString()"
                    :italic="true"
                  />
                  <app-hash-concat v-else :hash="tx.getTo().toString()" :link="'/address/' + tx.getTo().toString()" :italic="true" />
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <!--
          =====================================================================================
          ETH VALUE

          Responsive Tally:
          SM: 11/12 (2)
          MD: 8/12 (1)
          =====================================================================================
          -->
          <v-flex d-flex sm2 md1 pr-0>
            <p v-if="$vuetify.breakpoint.xsOnly" :class="[tx.getStatus() ? 'txSuccess--text mb-0' : 'txFail--text mb-0']">
              {{ $t('common.amount') }}: {{ getRoundNumber(tx.getValue().toEth()) }}
            </p>
            <p v-else :class="[tx.getStatus() ? 'txSuccess--text mb-0' : 'txFail--text mb-0']">
              {{
                getShortValue(
                  tx
                    .getValue()
                    .toEth()
                    .toString()
                )
              }}
              <v-tooltip v-if="isShortValue(tx.getValue().toEth())" bottom>
                <template #activator="data">
                  <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
                </template>
                <span>{{ tx.getValue().toEth() }}</span>
              </v-tooltip>
            </p>
          </v-flex>
          <!--
          =====================================================================================
            Age

            Responsive Tally:
            SM: 11/12 (0)
            MD: 11/12 (2)
          =====================================================================================
          -->
          <v-flex hidden-sm-and-down md2>
            <app-time-ago :timestamp="tx.getTimestamp()" />
          </v-flex>
          <!--
          =====================================================================================
            Tx Fee

            Responsive Tally:
            SM: 11/12 (0)
            MD: 9/12 (1)
          =====================================================================================
          -->
          <v-flex hidden-sm-and-down md1>
            <p class="black--text text-truncate mb-0">{{ getTxFee(tx) }}</p>
          </v-flex>
          <!--
          =====================================================================================
          STATUS

          Responsive Tally:
          SM: 12/12 (1)
          MD: 12/12 (1)
          =====================================================================================
          -->
          <v-flex v-if="!isPending" sm1>
            <v-icon v-if="tx.getStatus()" small class="txSuccess--text">fa fa-check-circle</v-icon>
            <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
          </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppHashConcat from '@app/core/components/ui/AppHashConcat.vue'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Tx, SimpleTx, EthValue } from '@app/core/models'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'

@Component({
  components: {
    AppTimeAgo,
    AppHashConcat
  }
})
export default class TableTxsRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) tx!: Tx | SimpleTx
  @Prop({ type: Boolean, default: false }) isPending

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getTxFee(_tx): string {
    return this.getRoundNumber(new EthValue(_tx.getGasPrice() * _tx.getGasUsed()).toEth())
  }

  /*
  ===================================================================================
   Computed
  ===================================================================================
  */

  get txStatusClass(): string {
    return this.tx.getStatus() ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
  }
}
</script>

<style scoped lang="css">
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
</style>
