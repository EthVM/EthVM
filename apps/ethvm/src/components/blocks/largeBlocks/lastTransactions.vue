<template>
  <v-card color="white" flat class="pt-3 pr-4 pl-4">
    <v-layout row wrap align-center pb-1>
      <v-flex xs8>
        <v-card-title class="title font-weight-bold">{{ $t('title.lastTxs') }}</v-card-title>
      </v-flex>
      <v-flex xs4>
        <v-layout justify-end>
          <v-btn outline color="secondary" class="text-capitalize" to="/transactions"> {{ $t('bttn.viewAll') }}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Table Header -->
    <v-card color="info" flat class="white--text pl-3 pr-1" height="40px">
      <v-layout align-center justify-start row fill-height pr-3>
        <v-flex xs6 sm8 md6>
          <h5>{{ $t( 'tableHeader.txN' ) }}</h5>
        </v-flex>
        <v-flex xs6 md4 md2>
          <h5>{{ $t( 'common.eth' ) }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md2>
          <h5>{{ $t( 'gas.limit' ) }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md>
          <h5>{{ $t( 'common.gwei' ) }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down v-if="!pending" md1>
          <h5>{{ $t( 'common.status' ) }}</h5>
        </v-flex>
        <v-flex v-else hidden-xs-and-up>
        </v-flex>
      </v-layout>
    </v-card>
    <!--End Table Header-->
    <v-card v-if="transactions.length > 0" flat id="scroll-target" :style="getStyle" class="scroll-y pt-0 pb-0">
      <v-layout column fill-height v-scroll:#scroll-target class="pt-1" style="margin-right: 1px">
        <v-flex xs12>
          <v-card v-for="tx in transactions" class="transparent pb-1" flat v-bind:key="tx.getHash()">
            <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
              <v-flex d-flex xs6 sm7 md8 md6>
                <v-layout row wrap align-center pb-1>
                  <v-flex d-flex xs12 pb-2>
                    <router-link class="primary--text text-truncate" :to="'/tx/'+tx.getHash()">{{tx.getHash()}}</router-link>
                  </v-flex>
                  <v-flex hidden-xs-and-down sm12 pt-0>
                    <v-layout row pl-2>
                      <p class="text-truncate info--text mb-0">{{ $t( 'tx.from' ) }}:
                        <router-link :to="'/address/'+tx.getFrom().toString()" class="secondary--text font-italic font-weight-regular">{{tx.getFrom().toString()}} </router-link>
                      </p>
                      <v-icon class="fas fa-arrow-right primary--text pl-2 pr-2 " small></v-icon>
                      <p class="text-truncate info--text font-weight-thin mb-0" v-if="tx.getContractAddress()">{{ $t( 'tx.contract' ) }}:
                        <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/'+tx.getContractAddress()">{{tx.getContractAddress()}} </router-link>
                      </p>
                      <p class="text-truncate info--text font-weight-thin mb-0" v-else><strong> {{ $t( 'tx.to' ) }}: </strong>
                        <router-link class="secondary--text font-italic font-weight-regular" :to="'/address/'+tx.getTo()">{{tx.getTo()}}</router-link>
                      </p>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs6 sm5 md4 md2>
                <p class="text-truncate black--text align-center mb-0">
                  <v-tooltip v-if="getShortEthValue(tx.getValue().toEth().toString(), true)" bottom>
                    <v-icon slot="activator" dark small>fa fa-question-circle info--text</v-icon>
                    <span>{{tx.getValue().toEth()}}</span>
                  </v-tooltip>
                  {{getShortEthValue(tx.getValue().toEth().toString(), false)}}
                </p>
              </v-flex>
              <v-flex hidden-sm-and-down md2>
                <p class="black--text  mb-0">{{tx.getGasUsed().toNumber()}}</p>
              </v-flex>
              <v-flex hidden-sm-and-down md1>
                <p class="text-truncate black--text mb-0">{{tx.getGasPrice().toGWei()}}</p>
              </v-flex>
              <v-flex  hidden-sm-and-down v-if="!pending" md1>
                <v-icon v-if="tx.getStatus()" small class="txSuccess--text"> fa fa-check-circle </v-icon>
                <v-icon v-else small class="txFail--text">fa fa-times-circle </v-icon>
              </v-flex>
              <v-flex v-else hidden-xs-and-up>
              </v-flex>
            </v-layout>
             <v-divider></v-divider>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
    <div v-else>
      <v-card class="mt-3 mb-3">
        <v-card-text v-if="!pending" class="text-xs-center text-muted">{{ $t('message.noTxHistory')}} </v-card-text>
        <v-card-text v-else class="text-xs-center text-muted">{{ $t('message.noPending') }} </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TableTransactions',
  props: {
    pending: {
      type: Boolean,
      defualt: false
    },
    frameTxs: {
      type: Boolean,
      default: false
    },
    showStyle: {
      type: String,
      default: ''
    },
    transactions: {}
  },
  data() {
    return {
      footnote: [
        {
          color: 'success',
          text: this.$i18n.t('footnote.success'),
          icon: 'fa-check-circle'
        },
        {
          color: 'warning',
          text: this.$i18n.t('footnote.failed'),
          icon: 'fa fa-times-circle'
        }
      ],
      color: 'grey'
    }
  },
  methods: {
    /* Method to reduce Strig length : */
    getShortEthValue(newEthValue, isBool) {
      const length = newEthValue.length
      let isShort = false
      if (length > 6) {
        newEthValue = newEthValue.slice(0, 6) + '...'
        isShort = true
      }
      if (!isBool) {
        return newEthValue
      }
      return isShort
    }
  },
  computed: {
    getStyle() {
      return this.showStyle
    }
  }
})
</script>
