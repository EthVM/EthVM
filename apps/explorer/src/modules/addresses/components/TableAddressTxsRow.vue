<template>
  <v-container pa-0 ma-0>
    <v-layout d-block>
      <!--
      =====================================================================================
        Mobile (XS)
      =====================================================================================
      -->
      <v-flex xs12 hidden-sm-and-up>
        <div :class="txStatusClass"></div>
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
            sm: 4/12 (5)
          =====================================================================================
          -->
          <v-flex sm4 md5 pr-3>
            <v-layout
              row
              wrap
              align-center
              pb-1
              pl-1
              class
              :class="{ 'pr-1': $vuetify.breakpoint.smAndDown, 'pr-3': $vuetify.breakpoint.mdOnly, 'pr-5': $vuetify.breakpoint.lgAndUp }"
            >
              <v-flex sm12 pa-1>
                <app-transform-hash :hash="tx.hash" :link="`/tx/${tx.hash}`" />
              </v-flex>
              <v-flex sm12 pa-1>
                <v-layout row align-center justify-space-around fill-height pa-2>
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
          SM: 6/12 (2)

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
              <v-tooltip v-if="isShortValue(ethValue(tx.valueBN))" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="{ on }" dark small>fa fa-question-circle info--text</v-icon>
                </template>
                <span>{{  formatStr(ethValue(tx.valueBN).toEth()) }}</span>
              </v-tooltip>
            </p>
          </v-flex>
          <!--
          =====================================================================================
            Tx Fee
            Responsive Tally:
            SM: 8/12 (2)
          =====================================================================================
          -->
          <v-flex sm2>
            <v-tooltip v-if="txType === 'in'" left>
              <template v-slot:activator="{ on }">
                <p
                  class="grey--text text-truncate"
                  v-on="on"
                >{{ getShortValue(ethValue(tx.feeBN.toFixed()).toEth()) }}</p>
              </template>
              <span>{{ $t('tooltip.txFeeSender') }}</span>
            </v-tooltip>
            <p
              v-else
              class="black--text text-truncate"
            >- {{ getShortValue(ethValue(tx.feeBN.toFixed()).toEth()) }}</p>
          </v-flex>

          <!--
          =====================================================================================
            Age

            Responsive Tally:
            SM: 10/12 (2)
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
          <v-flex sm2 md1>
            <v-layout pa-1 row justify-space-around>
              <v-icon v-if="tx.successful" small class="txSuccess--text">fa fa-check-circle</v-icon>
              <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
              <v-tooltip top content-class="more-info-tooltip" v-model="info">
                <template v-slot:activator="{ on }">
                  <v-btn icon small class="more-info-btn" v-on="on" @click="info = !info">
                    <v-icon small>fa fa-ellipsis-h</v-icon>
                  </v-btn>
                </template>
                <v-card color="white" flat>
                  <v-card-title v-if="tx.successful" class="txSuccess--text pa-1 body-2">Transaction successful</v-card-title>
                  <v-card-title v-else class="txFail--text pa-1 body-2">Transaction Failed</v-card-title>
                  <!-- Before Balance -->
                  <v-layout row align-center>
                    <v-flex grow pa-1>
                      <p>Balance Before:</p>
                    </v-flex>
                    <v-flex shrink pa-1>
                      <p class="text-xs-right">1000.00 {{$t('common.eth')}}</p>
                    </v-flex>
                  </v-layout>
                  <!-- Value Sent -->
                  <v-layout row align-center>
                    <v-flex grow pa-1>
                      <p>{{ getTooltipValueString()}}:</p>
                    </v-flex>
                    <v-flex shrink pa-1>
                      <p v-if="tx.successful" class="text-xs-right">{{getValueSign()}} {{  formatStr(ethValue(tx.valueBN).toEth()) }} {{$t('common.eth')}}</p>
                      <p v-else class="text-xs-right info--text">0 {{$t('common.eth')}}</p>
                    </v-flex>
                  </v-layout>
                  <!-- Tx Fee -->
                  <v-layout v-if="txType != 'in'" row align-center>
                    <v-flex grow pa-1>
                      <p>Tx Fee:</p>
                    </v-flex>
                    <v-flex shrink pa-1>
                      <p class="text-xs-right">- {{ formatStr(ethValue(tx.feeBN.toFixed()).toEth())}} {{$t('common.eth')}}</p>
                    </v-flex>
                  </v-layout>
                  <v-divider class="mb-2 mt-2" />
                  <!-- Before After -->
                  <v-layout row align-center>
                    <v-flex grow pa-1>
                      <p>Balance After:</p>
                    </v-flex>
                    <v-flex shrink pa-1>
                      <p class="text-xs-right">909.114665 {{$t('common.eth')}}</p>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-tooltip>
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

@Component({
  components: {
    AppTimeAgo,
    AppTransformHash
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
  info = false
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
        this.txTypeColor = 'warning'
      } else {
        throw new Error(this.tx.hash + ' Tx is a contract creation and missing contract string ')
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

  getTooltipValueString(): string {
    if (this.tx.successful) {
      return this.txType === 'in' ? 'Value recived' : 'Value Sent'
    }
    else {
      return this.txType === 'in' ? 'Actual Value recieved': "Actual Value Sent"
    }
  }

  /*
  ===================================================================================
   Computed
  ===================================================================================
  */

  get txStatusClass(): string {
    return this.tx.successful ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
  }
}
</script>

<style scoped lang="css">
.table-row-mobile {
  border: 1px solid #b4bfd2;
}

.tx-type-dsk {
  width: 160px;
}

.more-info-btn {
  color: #6270fc;
  margin: 0px;
}
.more-info-btn:hover {
  color: white;
  background-color: #b4bfd2;
}

.more-info-tooltip {
  background-color: white;
  border: 1px solid #b4bfd2;
  opacity: 1 !important;
  min-width: 280px;
}
</style>
