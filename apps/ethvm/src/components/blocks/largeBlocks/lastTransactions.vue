<template>
  <v-layout column>
    <v-card flat color="transparent" class="pb-1 mr-1 ml-1">
      <v-layout row wrap align-center class="pr-3 pl-1">
        <v-flex xs8>
          <h5 class="ml-1">{{ $t( 'tableHeader.txN' ) }}</h5>
        </v-flex>
        <v-flex xs3 md1>
          <h5>{{ $t( 'common.eth' ) }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md1>
          <h5>{{ $t( 'gas.limit' ) }}</h5>
        </v-flex>
        <v-flex hidden-sm-and-down md1>
          <h5>{{ $t( 'common.gwei' ) }}</h5>
        </v-flex>
        <v-flex v-if="!pending" xs1>
        </v-flex>
        <v-flex v-else hidden-xs-and-up>
        </v-flex>
      </v-layout>
    </v-card>
    <div v-if="transactions.length > 0" id="scroll-target" :style="getStyle" class="scroll-y pt-0 mb-3">
      <v-card v-scroll:#scroll-target v-for="tx in transactions" v-bind:key="tx.getHash()" class="pt-3 mb-3 mr-1 ml-1 elevation-2">
        <v-layout wrap align-center class="ma-0">
          <v-flex xs8>
            <p class="text-truncate">
              <router-link class="accent--text " :to="'/tx/'+tx.getHash()">{{tx.getHash()}}</router-link>
            </p>
            <v-layout row >
              <v-flex xs6 class="pt-0">
                <p class="text-truncate"><strong>{{ $t( 'tx.from' ) }} </strong>
                  <router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}} </router-link>
                </p>
              </v-flex>
              <v-flex xs6 class="pt-0">
                <p class="text-truncate" v-if="tx.getContractAddress().toString()"><strong> {{ $t( 'tx.contract' ) }}</strong>
                  <router-link :to="'/address/'+tx.getContractAddress().toString()">{{tx.getContractAddress().toString()}} </router-link>
                </p>
                <p class="text-truncate" v-else><strong> {{ $t( 'tx.to' ) }} </strong>
                  <router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link>
                </p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3 md1>
            <p class="text-truncate grey--text text--darken-2">
              <v-tooltip v-if="getShortEthValue(tx.getValue().toEth().toString(), true)" bottom>
                <v-icon slot="activator" dark small>fa fa-question-circle grey--text</v-icon>
                <span>{{tx.getValue().toEth()}}</span>
              </v-tooltip>
              {{getShortEthValue(tx.getValue().toEth().toString(), false)}}
            </p>
          </v-flex>
          <v-flex hidden-sm-and-down md1>
            <p class="grey--text text--darken-2">{{tx.getGasUsed().toNumber()}}</p>
          </v-flex>
          <v-flex hidden-sm-and-down md1>
            <p class="grey--text text--darken-2">{{tx.getGasPrice().toGWei()}}</p>
          </v-flex>
          <v-flex v-if="!pending" xs1 align-content-center>
            <v-icon v-if="tx.getStatus()" small class="success--text text-xs-center"> fa fa-check-circle </v-icon>
            <v-icon v-else small class="warning--text text-xs-center">fa fa-times-circle </v-icon>
          </v-flex>
          <v-flex v-else hidden-xs-and-up>
          </v-flex>
        </v-layout>
      </v-card>
    </div>
    <div v-else>
      <v-card class="mt-3 mb-3">
        <v-card-text v-if="!pending" class="text-xs-center text-muted">{{ $t('message.noTxHistory')}} </v-card-text>
        <v-card-text v-else class="text-xs-center text-muted">{{ $t('message.noPending') }} </v-card-text>
      </v-card>
    </div>
    <footnote v-if="!pending" :footnotes="footnote"></footnote>
  </v-layout>
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
    showHeader: {
      type: Boolean,
      default: true
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

