<template>
  <div class="last-transactions">
    <!-- If no Transactions: -->
    <div v-if="total == 0" class="info">
      <div class="info-common">
        <p>{{getText}}</p>
      </div>
    </div>
    <div v-else class="block-body">
      <div class="block-header" v-if="showheader === true">
        <li>{{ $t( 'tableHeader.txN' )}}</li>
        <li class="type"></li>
        <li class="eth">{{ $t( 'common.eth' )}}</li>
        <li class="limit">{{ $t( 'gas.limit' )}}</li>
        <li class="gas">{{ $t( 'common.gwei' )}}</li>
        <li class="status"></li>
      </div>
      <div class="block" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
        <li>
          <div class="hash-block">
            <p class="hash">
              <router-link :to="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</router-link>
            </p>
          </div>
          <div class="fromto">
            <p class="title">{{ $t( 'tx.from' )}}</p>
            <p class="">
              <router-link :to="'/address/'+tx.getFrom().toString()">{{tx.getFrom().toString()}}</router-link>
            </p>
            <p class="title" v-if="tx.getContractAddress().toString()">{{ $t( 'tx.contract' )}}</p>
            <p class="title" v-else>{{ $t( 'tx.to' )}}</p>
            <p class="" v-if="tx.getContractAddress().toString()">
              <router-link :to="'/address/'+tx.getContractAddress().toString()">{{tx.getContractAddress().toString()}}</router-link>
            </p>
            <p class="" v-else>
              <router-link :to="'/address/'+tx.getTo().toString()">{{tx.getTo().toString()}}</router-link>
            </p>
          </div>
        </li>
        <li class="vertical-middle type">
          <div v-if="getType(tx)">
            <span class="failed">{{ $t( 'type.out' )}}</span>
          </div>
          <div v-else>
            <span class="success">{{ $t( 'type.in' )}}</span>
          </div>
        </li>
        <li class="vertical-middle eth">
          <div class="">{{getShortEthValue(tx.getValue().toEth().toString(), false)}}</div>
          <div v-if="getShortEthValue(tx.getValue().toEth().toString(), true)" class="tooltip-button" v-tooltip="tx.getValue().toEth()"><i class="fa fa-question-circle-o" aria-hidden="true"></i></div>
        </li>
        <li class="vertical-middle limit">
          <div>
            <p>{{tx.getGasUsed().toNumber()}}</p>
          </div>
        </li>
        <li class="vertical-middle gas">
          <div>
            <p>{{tx.getGasPrice().toGWei()}}</p>
          </div>
        </li>
        <li class="vertical-middle status">
          <div v-if="!tx.getStatus()">
            <span class="glyphicon glyphicon-remove failed"></span>
          </div>
          <div v-else>
            <span class="glyphicon glyphicon-ok success"></span>
          </div>
        </li>
      </div>
      <div class="footnote">
        <ul>
          <li><i class="fa fa-check success" aria-hidden="true"></i> {{ $t('footnote.success') }}</li>
          <li><i class="fa fa-times failed" aria-hidden="true"></i> {{ $t('footnote.failed') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TableTransactions',
  props: ['transactions', 'showheader', 'account', 'filter', 'total', 'isPending'],
  methods: {
    getType(tx) {
      if (
        tx
          .getFrom()
          .toString()
          .toLowerCase() === this.account.toString().toLowerCase()
      ) {
        return true
      }
      return false
    },
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
    getText() {
      if (!this.isPending) {
        if (this.filter === 'all') {
          return this.$i18n.t('message.txAll')
        } else if (this.filter === 'in') {
          return this.$i18n.t('message.txIn')
        }
        return this.$i18n.t('message.txOut')
      }
      if (this.filter === 'all') {
        return this.$i18n.t('message.txPen')
      } else if (this.filter === 'in') {
        return this.$i18n.t('message.txPenIn')
      }
      return this.$i18n.t('message.txPenOut')
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/largeBlocks/addressTxTable.less';
</style>
