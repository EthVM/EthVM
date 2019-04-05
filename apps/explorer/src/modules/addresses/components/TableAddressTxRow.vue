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
            <v-container pa-0 ma-0>
              <v-layout d-block>
                <!--
                =====================================================================================
                  Mobile (XS)
                =====================================================================================
                -->
                <v-flex xs12 hidden-sm-and-up>
                  <div :class="getStatusClass(tx)">
                    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-4 pl-4">
                      <v-flex xs6 pa-1>
                        <p :class="getTxTypeClass(tx)">{{ getTypeString(tx) }}</p>
                      </v-flex>
                      <v-flex xs6 pr-4>
                        <v-layout row justify-end>
                          <p :class="getTxTypeClass(tx)">{{ getSign(tx) }} {{ getRoundNumber(tx.getValue().toEth()) }} {{ $t('common.eth') }}</p>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12>
                        <v-layout row>
                          <v-flex shrink pa-1>
                            <p class="info--text psmall">{{ $tc('tx.hash', 1) }}:</p>
                          </v-flex>
                          <v-flex xs9 pa-1>
                            <app-hash-concat :hash="tx.getHash()" :link="'/tx/' + tx.getHash()" />
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex shrink pa-1>
                        <p class="info--text psmall ">{{ $tc('address.name', 1) }}:</p>
                      </v-flex>
                      <v-flex shrink pa-1>
                        <div class="tx-icon-type">
                          {{ getTxTypeIcon(tx) }}
                        </div>
                      </v-flex>
                      <v-flex xs6 pa-2>
                        <app-hash-concat v-if="getType(tx) === 'self'" :hash="tx.getFrom().toString()" :italic="true" />
                        <div v-else>
                          <div v-if="tx.getContractAddress().isEmpty()">
                            <app-hash-concat
                              v-if="getType(tx) === 'in'"
                              :hash="tx.getTo().toString()"
                              :italic="true"
                              :link="'/address/' + tx.getTo().toString()"
                            />
                            <app-hash-concat v-else :hash="tx.getFrom().toString()" :italic="true" :link="'/address/' + tx.getFrom().toString()" />
                          </div>
                          <div v-else>
                            <app-hash-concat
                              :hash="tx.getContractAddress().toString()"
                              :italic="true"
                              :link="'/address/' + tx.getContractAddress().toString()"
                            />
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-flex>

                <v-flex xs12 hidden-xs-only>
                  <!--
                  =====================================================================================
                    Tablet/ Desktop (SM - XL)
                  =====================================================================================
                   -->
                  <v-layout grid-list-sm row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
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
                      <router-link class="primary--text text-truncate font-italic psmall" :to="'/block/' + tx.getBlockHash()">{{
                        tx.getBlockNumber()
                      }}</router-link>
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
                    <v-flex d-flex sm6 pr-3>
                      <v-layout row wrap pa-1>
                        <v-flex sm12>
                          <v-layout row>
                            <v-flex shrink pa-1>
                              <p class="info--text psmall">{{ $tc('tx.hash', 1) }}:</p>
                            </v-flex>
                            <v-flex sm10 pa-1>
                              <app-hash-concat :hash="tx.getHash()" :link="'/tx/' + tx.getHash()" />
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex sm12>
                          <v-layout row align-center justify-start>
                            <v-flex shrink pa-1>
                              <div class="tx-icon-type">
                                <p>{{ getTxTypeIcon(tx) }}</p>
                              </div>
                            </v-flex>
                            <v-flex v-if="getType(tx) === 'self'" sm10>
                              <app-hash-concat :hash="tx.getFrom().toString()" :italic="true" />
                            </v-flex>
                            <v-flex sm10 v-else>
                              <div v-if="tx.getContractAddress().isEmpty()">
                                <app-hash-concat
                                  v-if="getType(tx) === 'in'"
                                  :hash="tx.getTo().toString()"
                                  :italic="true"
                                  :link="'/address/' + tx.getTo().toString()"
                                />
                                <app-hash-concat v-else :hash="tx.getFrom().toString()" :italic="true" :link="'/address/' + tx.getFrom().toString()" />
                              </div>
                              <div v-else>
                                <app-hash-concat
                                  :hash="tx.getContractAddress().toString()"
                                  :italic="true"
                                  :link="'/address/' + tx.getContractAddress().toString()"
                                />
                              </div>
                            </v-flex>
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
                          {{ getSign(tx) }}{{ getRoundNumber(tx.getValue().toEth()) }}
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
                      <app-time-ago :timestamp="tx.getTimestamp()" />
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
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { StringConcatMixin } from '@app/core/components/mixins'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppHashConcat from '@app/core/components/ui/AppHashConcat.vue'
import { TranslateResult } from 'vue-i18n'

@Component({
  components: {
    AppTimeAgo,
    AppHashConcat
  }
})
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

  getTypeString(tx): TranslateResult {
    const type = this.getType(tx)
    switch (type) {
      case 'in':
        return this.$i18n.t('filter.in')
      case 'out':
        return this.$i18n.t('filter.out')
      default:
        return this.$i18n.t('tx.self')
    }
  }

  getTxTypeClass(tx): string {
    const type = this.getType(tx)
    switch (type) {
      case 'in':
        return 'tx-in'
      case 'out':
        return 'tx-out'
      default:
        return 'tx-self'
    }
  }

  getTxTypeIcon(tx): TranslateResult {
    const type = this.getType(tx)
    switch (type) {
      case 'in':
        return this.$i18n.t('tx.from')
      case 'out':
        return this.$i18n.t('tx.to')
      default:
        return `${this.$i18n.t('tx.from')} | ${this.$i18n.t('tx.to')}`
    }
  }

  getType(tx): string {
    if (
      tx
        .getTo()
        .toString()
        .toUpperCase() ===
      tx
        .getFrom()
        .toString()
        .toUpperCase()
    ) {
      return 'self'
    }

    return tx
      .getFrom()
      .toString()
      .toUpperCase() === this.account.toUpperCase()
      ? 'out'
      : 'in'
  }

  getSign(tx): string {
    const type = this.getTypeString(tx)
    switch (type) {
      case this.$i18n.t('tx.self'):
        return ''
      case this.$i18n.t('filter.in'):
        return '+'
      default:
        return '-'
    }
  }

  getStatusClass(tx): string {
    return tx.getStatus() ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
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
