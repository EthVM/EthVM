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
            SM: 4/12 (4)
          =====================================================================================
          -->
          <v-flex sm4 pr-3>
            <v-layout row wrap align-center pb-1>
              <v-flex sm12 pa-2>
                <app-transform-hash :hash="tx.hash" :link="`/tx/${tx.hash}`"/>
              </v-flex>
              <v-flex sm12 pa-2>
                <v-layout row align-center justify-space-around fill-height pa-2>
                  <v-card flat class="tx-type-dsk white--text pa-1 mr-2" :color="txTypeColor">
                    <p class="text-xs-center">{{$t(`tx.type.${txType}`)}}</p>
                  </v-card>
                  <app-transform-hash
                    :hash="displayAdr"
                    :link="linkAdr"
                    :italic="true"
                  />

                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <!--
          =====================================================================================
          ETH VALUE

          Responsive Tally:
          SM: 2/12 (6)

          =====================================================================================
          -->
          <v-flex sm2 pr-0 :class="getValueColor()">
            <p  >
              {{ `${getValueSign()} ${
              getShortValue(
              ethValue(tx.valueBN)
              .toEth()
              .toString()
              )}`
              }}
              <v-tooltip v-if="isShortValue(ethValue(tx.valueBN))" bottom>
                <template #activator="data">
                  <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
                </template>
                <span>{{ ethValue(tx.valueBN).toEth() }}</span>
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
            <app-time-ago :timestamp="tx.timestampDate"/>
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
            <p class="black--text text-truncate mb-0">{{ ethValue(tx.feeBN.toFixed()).toEth() }}</p>
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
            <v-icon v-if="tx.successful" small class="txSuccess--text">fa fa-check-circle</v-icon>
            <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
          </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2"/>
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
  txTypeColor?:string
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
          // replace when isToContract implemented with: this.to.isToContract? `/contract/${tx.from}` : `/address/${tx.from}`
          this.linkAdr = `/address/${this.adrHash}`
          this.txTypeColor='info'
          return
        }
        case this.tx.to === this.adrHash: {
          this.txType = 'in'
          this.displayAdr = this.tx.from
          // replace when isToContract implemented with: this.to.isToContract? `/contract/${tx.from}` : `/address/${tx.from}`
          this.linkAdr = `/address/${this.tx.from}`
          this.txTypeColor = 'dakrGrey'
          return
        }
        default: {
          console.log(this.tx)
          this.txType = 'out'
          if (this.tx.to) {
            this.displayAdr = this.tx.to
            // replace when isToContract implemented with: this.to.isToContract? `/contract/${tx.to}` : `/address/${tx.to}`
            this.linkAdr = `/address/${this.tx.to}`
            this.txTypeColor = 'error'
          } else {
          }
        }
      }
    } else if (!this.tx.to && this.tx.isContractCreation) {
      this.txType = 'ctrCreate'
      if (this.tx.creates) {
        this.displayAdr = this.tx.creates
        this.linkAdr = `/contract/${this.tx.creates}`
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

  getValueColor(): string{
    return (!this.tx.successful || this.txType === 'self') ? 'grey--text' : 'black--text'
  }

  getValueSign(): string {
    if(!this.tx.successful || this.txType === "self") {
      return ''
    }
    else {
      return this.txType === 'in'? '+' :'-'
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
  width: 220px;
}
</style>
