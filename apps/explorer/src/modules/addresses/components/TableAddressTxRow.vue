<template>
  <v-card color="white" flat class="pt-0 pb-2">
    <v-card flat v-if="isSyncing && type">
      <v-layout row align-center justify-center fill-height>
        <v-card-title class="text-xs-center pt-5 pb-5">{{ $t('message.sync.no-pen-tx') }}</v-card-title>
      </v-layout>
    </v-card>
    <v-card v-else flat id="scroll-target" class=" pt-0 pb-0">
      <v-layout column fill-height class="pt-1" style="margin-right: 1px">
        <v-flex xs12>
          <v-card v-if="transactions.length == 0" flat>
            <v-card-text class="text-xs-center secondary--text">{{ text }}</v-card-text>
          </v-card>
          <v-card v-else v-for="tx in transactions" class="transparent pb-1" flat :key="tx.getHash()">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
              <!--
              =====================================================================================
                  BLOCK NUMBER / HASH

                  Responsive Tally:
                  XS: 0/12 (0)
                  SM: 3/12 (0)
                  MD: 1/12 (1)
                  LG: 1/12 (1)
              =====================================================================================
              -->
              <v-flex hidden-sm-and-down md1 pr-1>
                <router-link class="primary--text text-truncate font-italic psmall" :to="'/block/' + tx.getBlockHash()">{{ tx.getBlockNumber() }}</router-link>
              </v-flex>
              <!--
              =====================================================================================
                TRANSACTION # / HASH

                Responsive Tally:
                XS: 7/12 (7)
                SM: 6/12 (6)
                MD: 7/12 (6)
                LG: 7/12 (6)
              =====================================================================================
              -->
              <v-flex d-flex xs7 sm6 pr-3>
                <v-layout row wrap align-center pb-1>
                  <v-flex d-flex xs12 pb-2>
                    <router-link class="primary--text text-truncate font-mono psmall" :to="'/tx/' + tx.getHash()">{{ tx.getHash() }}</router-link>
                  </v-flex>
                  <v-flex hidden-xs-only sm12 pt-0>
                    <v-layout row pl-2>
                      <p v-if="!getType(tx)" class="text-truncate info--text mb-0">
                        {{ $t('tx.from') }}:
                        <router-link :to="'/address/' + tx.getFrom().toString()" class="secondary--text font-mono font-italic font-weight-regular pr-1"
                          >{{ tx.getFrom().toString() }}
                        </router-link>
                      </p>
                      <p class="text-truncate info--text mb-0" v-if="getType(tx) && !tx.getContractAddress().isEmpty()">
                        {{ $t('contract.name') }}:
                        <router-link
                          class="secondary--text font-mono font-italic font-weight-regular pr-1"
                          :to="'/address/' + tx.getContractAddress().toString()"
                          >{{ tx.getContractAddress().toString() }}
                        </router-link>
                      </p>
                      <p class="text-truncate info--text mb-0 mr-3" v-if="getType(tx) && tx.getContractAddress().isEmpty()">
                        {{ $t('tx.to') }}:
                        <router-link class="secondary--text font-mono font-italic font-weight-regular pr-1" :to="'/address/' + tx.getTo().toString()"
                          >{{ tx.getTo().toString() }}
                        </router-link>
                      </p>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!--
              =====================================================================================
                ETH VALUE

                Responsive Tally:
                XS: 12/12 (5)
                SM: 8/12 (2)
                MD: 9/12 (2)
                LG: 8/12 (1)
              =====================================================================================
              -->
              <v-flex d-flex xs5 sm2 lg1 pl-0>
                <v-layout
                  align-center
                  row
                  pl-2
                  v-if="
                    !isShortValue(
                      tx
                        .getValue()
                        .toEth()
                        .toString()
                    )
                  "
                >
                  <p :class="[!getType(tx) ? 'success--text mb-0 text-truncate' : 'error--text mb-0 text-truncate']">
                    {{ getSign(tx) }}{{ getShortValue(tx.getValue().toEth()) }}
                  </p>
                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-icon v-on="data.on" small class="info--text text-xs-center ml-1">fa fa-question-circle</v-icon>
                    </template>
                    <span>{{
                      formatStr(
                        tx
                          .getValue()
                          .toEth()
                          .toString()
                      )
                    }}</span>
                  </v-tooltip>
                </v-layout>
                <p v-else :class="[!getType(tx) ? 'success--text mb-0 ' : 'error--text mb-0 ']">{{ getSign(tx) }}{{ tx.getValue().toEth() }}</p>
              </v-flex>
              <!--
              =====================================================================================
                Age

                Responsive Tally:
                XS: 12/12 (0)
                SM: 11/12 (3)
                MD: 11/12 (2)
                LG: 10/12 (2)
              =====================================================================================
              -->
              <v-flex hidden-xs-only sm3 md2>
                <p class="black--text text-truncate mb-0"><timeago :datetime="tx.getTimestamp()" :auto-update="60"></timeago></p>
              </v-flex>
              <!--
              =====================================================================================
                GWEI

                Responsive Tally:
                XS: 12/12 (0)
                SM: 11/12 (0)
                MD: 11/12 (0)
                LG: 11/12 (1)
              =====================================================================================
              -->
              <v-flex hidden-md-and-down lg1>
                <p class="text-truncate black--text mb-0">{{ getTxFee(tx) }}</p>
              </v-flex>
              <!--
              =====================================================================================
                STATUS

                Responsive Tally:
                XS: 12/12 (0)
                SM: 12/12 (1)
                MD: 12/12 (1)
                LG: 12/12 (1)
              =====================================================================================
              -->
              <v-flex hidden-xs-only sm1>
                <v-icon v-if="tx.getStatus()" small class="txSuccess--text">fa fa-check-circle {{ log(tx) }}</v-icon>
                <v-icon v-else small class="txFail--text">fa fa-times-circle {{ log(tx) }}</v-icon>
              </v-flex>
            </v-layout>
            <v-divider />
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { StringConcatMixin } from '@app/core/components/mixins'

@Component
export default class TableAddressTxRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String, required: true }) account!: string
  @Prop(Array) transactions!: any[]
  @Prop({ type: Number, default: 0 }) filter!: number
  @Prop({ type: Boolean, default: false }) type!: boolean

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getType(tx): boolean {
    return (
      tx
        .getFrom()
        .toString()
        .toUpperCase() === this.account.toUpperCase()
    )
  }

  getSign(tx): string {
    return this.getType(tx) ? '-' : '+'
  }

  log(tx) {}

  getTxFee(tx): string {
    return this.getRoundNumber(tx.getTxCost().toEth())
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get text(): string {
    const mesg = [this.$i18n.t('message.tx.no-all'), this.$i18n.t('message.tx.no-in'), this.$i18n.t('message.tx.no-out')]
    const penMesg = [this.$i18n.t('message.tx.no-pen'), this.$i18n.t('message.tx.no-pen-in'), this.$i18n.t('message.tx.no-pen-out')]
    if (!this.type) {
      return mesg[this.filter].toString()
    }

    return penMesg[this.filter].toString()
  }

  get isSyncing() {
    return this.$store.getters.syncing
  }
}
</script>
