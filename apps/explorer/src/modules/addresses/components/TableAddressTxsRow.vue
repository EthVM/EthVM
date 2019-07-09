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
          <v-layout column fill-height wrap class="pa-3">
            <!-- Value, Age, Status -->
            <v-flex d-flex xs12>
              <v-layout row>
                <v-flex>
                  <p>
                    {{
                    `${getValueSign()} ${getShortValue(
                    ethValue(tx.valueBN)
                    .toEth()
                    .toString()
                    )}`
                    }} {{$t('common.eth')}}
                  </p>
                </v-flex>
                <v-spacer />
                <v-flex shrink>
                  <app-time-ago :timestamp="tx.timestampDate" class="info--text" />
                </v-flex>
                <v-flex shrink>
                  <v-icon v-if="tx.successful" small class="txSuccess--text">fa fa-check-circle</v-icon>
                  <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- Tx Hash -->
            <v-flex d-flex xs12>
              <v-layout row align-center justify-start class="pl-2">
                <div class="tx-hash-label">
                  <p class="info--text">{{$tc('tx.hash', 1)}}:</p>
                </div>
                  <app-transform-hash :hash="displayAdr" :link="linkAdr" :italic="true" />
              </v-layout>
            </v-flex>
            <!-- TxType and address Hash -->
            <v-flex d-flex xs12>
              <v-layout row align-center justify-start>
                <v-flex d-flex xs10>
                  <v-layout row align-center fill-height class="pl-2">
                    <v-card
                      flat
                      class="tx-type-dsk white--text pa-1 mr-2 caption"
                      :color="txTypeColor"
                    >
                      <p class="text-xs-center">{{ $t(`tx.type.${txType}`) }}</p>
                    </v-card>
                    <app-transform-hash :hash="displayAdr" :link="linkAdr" :italic="true" />
                  </v-layout>
                </v-flex>
                <v-spacer />
                <v-flex shrink>
                  <address-tx-balance :tooltipInfo="balanceTooltip" />
                </v-flex>
              </v-layout>
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
            TRANSACTION # / Address HASH

            Responsive Tally:
            md: 5/12 (5)
            sm: 4/12 (4)
          =====================================================================================
          -->
          <v-flex sm5 md4 pr-3>
            <v-layout
              row
              wrap
              align-center
              pb-1
              pl-1
              class
              :class="{ 'pr-1': $vuetify.breakpoint.smAndDown, 'pr-3': $vuetify.breakpoint.mdOnly, 'pr-4': $vuetify.breakpoint.lgAndUp }"
            >
              <v-flex sm12 pa-1>
                <app-transform-hash :hash="tx.hash" :link="`/tx/${tx.hash}`" />
              </v-flex>
              <v-flex sm12 pa-1>
                <v-layout row align-center fill-height pa-2>
                  <v-card
                    flat
                    class="tx-type-dsk white--text pa-1 mr-2 caption"
                    :color="txTypeColor"
                  >
                    <p class="text-xs-center">{{ $t(`tx.type.${txType}`) }}</p>
                  </v-card>
                  <app-transform-hash :hash="displayAdr" :link="linkAdr" :italic="true" />
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <!--
          =====================================================================================
          ETH VALUE

          Responsive Tally:
          SM: 7/12 (2)
          MD: 6/12 (2)

          =====================================================================================
          -->
          <v-flex sm2 pr-0 :class="getValueColor()">
            <p>
              {{
              `${getValueSign()} ${getShortValue(
              ethValue(tx.valueBN)
              .toEth()
              .toString()
              )}`
              }}
            </p>
          </v-flex>
          <!--
          =====================================================================================
            Tx Fee
            Responsive Tally:
            SM: 9/12 (2)
            MD: 8/12 (2)
          =====================================================================================
          -->
          <v-flex sm2>
            <v-tooltip v-if="txType === 'in'" left>
              <template v-slot:activator="{ on }">
                <p
                  class="grey--text text-truncate"
                  v-on="on"
                >{{ getShortValue(ethValue(tx.feeBN).toEth()) }}</p>
              </template>
              <span>{{ $t('tooltip.txFeeSender') }}</span>
            </v-tooltip>
            <p
              v-else
              class="black--text text-truncate"
            >- {{ getShortValue(ethValue(tx.feeBN).toEth()) }}</p>
          </v-flex>

          <!--
          =====================================================================================
            Age

            Responsive Tally:
            SM: 11/12 (1)
            MD: 10/12(2)
          =====================================================================================
          -->
          <v-flex sm2>
            <app-time-ago :timestamp="tx.timestampDate" />
          </v-flex>
          <!--
          =====================================================================================
          STATUS

          Responsive Tally:
          lg: 12/12 (1)
          md: 12/12 (2)
          =====================================================================================
          -->
          <v-flex sm1 md2>
            <v-layout pa-1 row justify-space-around>
              <v-icon v-if="tx.successful" small class="txSuccess--text">fa fa-check-circle</v-icon>
              <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
              <address-tx-balance :tooltipInfo="balanceTooltip" />
            </v-layout>
          </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { StringConcatMixin } from '@app/core/components/mixins'
import { EthValue } from '@app/core/models'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import BigNumber from 'bignumber.js'
import { TransactionSummaryPageExt_items } from '@app/core/api/apollo/extensions/transaction-summary-page.ext'
import { TranslateResult } from 'vue-i18n'
import { AdrTxBalance } from '@app/core/components/props'
import AddressTxBalance from '@app/modules/addresses/components/AddressTxBalance.vue'

@Component({
  components: {
    AppTimeAgo,
    AppTransformHash,
    AddressTxBalance
  }
})
export default class TableTxsRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) tx!: TransactionSummaryPageExt_items
  @Prop({ type: Boolean, default: false }) isPending
  @Prop(String) adrHash!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  txType?: string
  linkAdr?: string
  displayAdr?: string
  txTypeColor?: string

  /*
  ===================================================================================
    LifeCycle
  ===================================================================================
  */

  created() {
    if (this.tx.to && !this.tx.isContractCreation) {
      switch (true) {
        case this.tx.from === this.tx.to: {
          this.txType = 'self'
          this.displayAdr = this.adrHash
          this.linkAdr = `/address/${this.adrHash}`
          this.txTypeColor = 'info'
          return
        }
        case this.tx.to === this.adrHash: {
          this.txType = 'in'
          this.displayAdr = this.tx.from
          this.linkAdr = `/address/${this.tx.from}`
          this.txTypeColor = 'darkGrey'
          return
        }
        default: {
          this.txType = 'out'
          this.displayAdr = this.tx.to
          this.linkAdr = `/address/${this.tx.to}`
          this.txTypeColor = 'error'
        }
      }
    } else if (!this.tx.to && this.tx.isContractCreation) {
      this.txType = 'ctrCreate'
      if (this.tx.creates) {
        this.displayAdr = this.tx.creates
        this.linkAdr = `/address/${this.tx.creates}`
        this.txTypeColor = '#b3d4fc'
      } else {
        throw new Error(`${this.tx.hash} Tx is a contract creation and missing contract string`)
      }
    } else {
      throw new Error('Tx is missing <To> parameter')
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  ethValue(number: BigNumber) {
    return new EthValue(number)
  }

  getValueColor(): string {
    return !this.tx.successful || this.txType === 'self' ? 'grey--text' : 'black--text'
  }

  getValueSign(): string {
    if (!this.tx.successful || this.txType === 'self') {
      return ''
    }
    return this.txType === 'in' ? '+' : '-'
  }

  /*
  ===================================================================================
   Computed
  ===================================================================================
  */
  get balanceTooltip(): AdrTxBalance {
    return {
      type: this.txType,
      status: this.tx.successful,
      value: `${this.getValueSign()} ${this.formatStr(this.ethValue(this.tx.valueBN).toEth())}`,
      fee: this.formatStr(this.ethValue(this.tx.feeBN).toEth()),
      //Temp Value, to be changed on the implementation
      balBefore: 10000,
      balAfter: 23432
    }
  }
}
</script>

<style scoped lang="css">
.table-row-mobile {
  border: 1px solid #b4bfd2;
}

.tx-type-dsk {
  min-width: 100px;
}
.tx-hash-label {
  min-width: 3em;
}

</style>
