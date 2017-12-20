<template>
<div class="standard-table-1">
  <p class="table-title">
    <icon name='refresh'
          scale='1'></icon> Latest Transactions</p>
  <transition-group name="list">
    <div class="data-block-loop"
         v-for="tx in transactions"
         v-bind:key="tx.getHash()">
      <!-- .data-block-1 -->
      <div class="data-block-1">
        <div>Hash <span>{{tx.getHash()}}</span></div>
        <div>Gas <span>{{common.HexNumber(tx.getGasUsed()).toNumber()}}</span></div>
        <div>Gas Price <span>{{common.EthValue(tx.getGasPrice()).toGWei()}} gwei</span></div>
        <div>Block <span>{{common.HexNumber(tx.getBlockNumber()).toNumber()}}</span></div>
      </div>
      <!-- .data-block-1 -->
      <!-- .data-block-2 -->
      <div class="data-block-2">
        <div>
          <h1>From</h1>
          <p>{{tx.getFrom()}}</p>
        </div>
        <div>
          <div class="data-icon-container">
            <icon name='long-arrow-right'
                  scale='1'></icon> <span></span>
          </div>
          <p class="amount">{{common.EthValue(tx.getValue()).toEth()}}&nbsp;ETH</p>
        </div>
        <div>
          <h1>To</h1>
          <p>{{tx.getTo()}}</p>
        </div>
      </div>
      <!-- .data-block-2 -->
      <!--sub txs -->
      <div class="data-block-sub">
        <div v-for="transfer in tx.getTrace().transfers"
             v-if="transfer.value != '0x'">
          <div class="sub-icon">
            <icon name='code-fork'
                  scale='1'></icon>
          </div>
          <div>
            <h1>From</h1>
            <p>{{transfer.from}}</p>
          </div>
          <div>
            <h1>To</h1>
            <p>{{transfer.to}}</p>
          </div>
          <div>
            <h1>Value</h1>
            <p>{{common.EthValue(transfer.value).toEth()}}&nbsp;ETH</p>
          </div>
          <div>
            <h1>Type</h1>
            <p>{{transfer.op}}</p>
          </div>
        </div>
      </div>
      <!--sub txs -->
    </div>
    <!-- .data-block-loop -->
  </transition-group>
</div>
<!-- .standard-table-1 -->

</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import { common } from '@/libs'
export default Vue.extend({
  name: 'block-container',
  props: [
    'maxItems'
  ],
  data () {
    return {
      store: store,
      txSplice: [],
      common: common
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.$socket.emit('pastData', '')
    }
    )
  },
  computed: {
    transactions () {
      return store.getters.getTxs.slice(0, this.maxItems)
    }
  }
})
</script>

<style lang="less" scoped="">
@import "~lessPath/animations.less";
@import '~lessPath/standardTables';
.data-block-sub {
  >div {
    .sub-icon {
      vertical-align: top;
      svg {
        padding: 2px;
        width: 17px;
        height: 17px;
        border-radius: 20px;
        border: 1px solid black;
      }
    }
    >div:nth-child(1) {
      width: 22px;
    }
    >div:nth-child(2) {
      width: 25%;
    }
    >div:nth-child(3) {
      width: 25%;
    }
    >div:nth-child(4) {
      width: 20%;
    }
    >div:nth-child(5) {
      width: 20%;
    }
  }
}

/***********************
 Mobile Responsive
***********************/

@media screen and (min-width: 700px) and (max-width: 1199px) {
  .data-block-sub {
    >div {
      .sub-icon {
        vertical-align: top;
        svg {
          padding: 2px;
          width: 17px;
          height: 17px;
          border-radius: 20px;
          border: 1px solid black;
        }
      }
      >div:nth-child(1) {
        width: 22px;
      }
      >div:nth-child(2) {
        width: 30%;
      }
      >div:nth-child(3) {
        width: 30%;
      }
      >div:nth-child(4) {
        width: 20%;
      }
      >div:nth-child(5) {
        width: 10%;
      }
    }
  }
}

@media screen and (max-width: 699px) {
  .data-block-sub {
    >div {
      .sub-icon {
        vertical-align: top;
        svg {
          padding: 2px;
          width: 17px;
          height: 17px;
          border-radius: 20px;
          border: 1px solid black;
        }
      }
      >div:nth-child(1) {
        width: 22px;
      }
      >div:nth-child(2) {
        width: 20%;
      }
      >div:nth-child(3) {
        width: 20%;
      }
      >div:nth-child(4) {
        width: 20%;
      }
      >div:nth-child(5) {
        width: 20%;
      }
    }
  }
}
</style>
