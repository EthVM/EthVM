<template>
  <div class="last-transactions">
    <!-- If no Transactions: -->
    <v-card v-if="total == 0" flat>
      <v-card-text class="text-xs-center secondary--text">{{ getText }}</v-card-text>
    </v-card>
    <v-card v-else color="white" flat class="pt-0 pb-2">
      <v-layout justify-end class="pb-1"> <footnote :footnotes="footnote"></footnote> </v-layout>
      <!-- Table Header -->
      <v-card color="primary" flat class="white--text pl-3 pr-1" height="40px">
        <v-layout align-center justify-start row fill-height pr-3>
          <v-flex xs6 sm8 md5 pl-3>
            <h5 class="pl-4">{{ $t('tableHeader.txN') }}</h5>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <h5>{{ $t('common.eth') }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down md2>
            <h5>{{ $t('gas.limit') }}</h5>
          </v-flex>
          <v-flex hidden-sm-and-down md2>
            <h5>{{ $t('common.gwei') }}</h5>
          </v-flex>
          <v-flex hidden-xs-only sm1>
            <h5>{{ $t('common.status') }}</h5>
          </v-flex>
        </v-layout>
      </v-card>
      <v-card flat id="scroll-target" style="max-height: 800px" class="scroll-y pt-0 pb-0">
        <v-layout column fill-height v-scroll:#scroll-target class="pt-1" style="margin-right: 1px">
          <v-flex xs12>
            <v-card v-for="tx in transactions" class="transparent pb-1" flat :key="tx.getHash()">
              <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
                <v-flex d-flex xs6 sm8 md5 pr-3>
                  <div v-if="!type">
                    <v-icon v-if="getType(tx)" class="fas fa-circle warning--text pr-3" small />
                    <v-icon v-else class="fas fa-circle success--text pr-3" small />
                  </div>
                  <v-layout row wrap align-center pb-1>
                    <v-flex d-flex xs12 pb-2>
                      <router-link class="primary--text text-truncate font-italic psmall" :to="'/tx/' + tx.getHash()">{{ tx.getHash() }}</router-link>
                    </v-flex>
                    <v-flex hidden-xs-and-down sm12 pt-0>
                      <v-layout row pl-2>
                        <p class="text-truncate info--text mb-0 ">
                          {{ $t('tx.from') }}:
                          <router-link :to="'/address/' + tx.getFrom().toString()" class="secondary--text font-italic font-weight-regular"
                            >{{ tx.getFrom().toString() }}
                          </router-link>
                        </p>
                        <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2 " small></v-icon>
                        <p class="text-truncate info--text font-weight-thin mb-0" v-if="tx.getContractAddress()">
                          {{ $t('tx.contract') }}:
                          <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getContractAddress()"
                            >{{ tx.getContractAddress() }}
                          </router-link>
                        </p>
                        <p class="text-truncate info--text font-weight-thin mb-0" v-else>
                          <strong> {{ $t('tx.to') }}: </strong>
                          <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/' + tx.getTo()">{{ tx.getTo() }}</router-link>
                        </p>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex d-flex xs6 sm3 md2>
                  <p :class="[tx.getStatus() ? 'txSuccess--text mb-0' : 'txFail--text mb-0']">
                    <v-tooltip
                      v-if="
                        getShortEthValue(
                          tx
                            .getValue()
                            .toEth()
                            .toString(),
                          true
                        )
                      "
                      bottom
                    >
                      <v-icon slot="activator" dark small>fa fa-question-circle info--text</v-icon>
                      <span>{{ tx.getValue().toEth() }}</span>
                    </v-tooltip>
                    {{
                      getShortEthValue(
                        tx
                          .getValue()
                          .toEth()
                          .toString(),
                        false
                      )
                    }}
                  </p>
                </v-flex>
                <v-flex hidden-sm-and-down md2>
                  <p class="black--text text-truncate mb-0">{{ tx.getGasUsed() }}</p>
                </v-flex>
                <v-flex hidden-sm-and-down md2>
                  <p class="text-truncate black--text mb-0">{{ tx.getGasPrice() }}</p>
                </v-flex>
                <v-flex hidden-xs-only sm1>
                  <v-icon v-if="tx.getStatus()" small class="txSuccess--text"> fa fa-check-circle {{ log(tx) }}</v-icon>
                  <v-icon v-else small class="txFail--text">fa fa-times-circle {{ log(tx) }}</v-icon>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TableTransactions',
  props: {
    transactions: Array,
    account: {
      type: String,
      required: true
    },
    filter: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    type: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      footnote: [
        {
          color: 'success',
          text: this.$i18n.t('type.in'),
          icon: 'fa fa-circle'
        },
        {
          color: 'warning',
          text: this.$i18n.t('type.out'),
          icon: 'fa fa-circle'
        }
      ]
    }
  },
  methods: {
    getType(tx) {
      // @ts-ignore
      return tx.getFrom().toLowerCase() === this.account.toLowerCase()
    },
    getShortEthValue(newEthValue, isBool) {
      const length = newEthValue.length
      let isShort = false
      if (length > 8) {
        newEthValue = newEthValue.slice(0, 8) + '...'
        isShort = true
      }
      if (!isBool) {
        return newEthValue
      }
      return isShort
    },
    log(tx) {}
  },
  computed: {
    getText() {
      if (!this.isPending) {
        if (this.filter === 0) {
          return this.$i18n.t('message.txAll')
        } else if (this.filter === 1) {
          return this.$i18n.t('message.txIn')
        }
        return this.$i18n.t('message.txOut')
      }
      if (this.filter === '2') {
        return this.$i18n.t('message.txPen')
      } else if (this.filter === '1') {
        return this.$i18n.t('message.txPenIn')
      }
      return this.$i18n.t('message.txPenOut')
    }
  }
})
</script>

<style scoped lang="less">
// @import '~lessPath/sunil/blocks/largeBlocks/addressTxTable.less';
</style>
