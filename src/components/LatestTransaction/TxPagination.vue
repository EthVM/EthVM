<template>
<div class="standard-table-1">
  <p class="table-title">
    <icon name='refresh'
          scale='1'></icon> Latest Transactions</p>
  <paginate name="pTxs"
            :list="txs"
            :per=per>
    <!-- FOR LOOP -->
    <div class="data-block-loop"
         v-for="tx in paginated('pTxs')"
         v-bind:key="tx.getHash().toString()">
      <!-- .data-block-1 -->
      <div class="data-block-1">
        <div>Hash <span><a :href="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</a></span></div>
        <div>Gas <span>{{tx.getGasUsed().toNumber()}}</span></div>
        <div>Gas Price <span>{{tx.getGasPrice().toGWei()}} gwei</span></div>
        <div>Block <span>{{tx.getBlockNumber().toNumber()}}</span></div>
      </div>
      <!-- .data-block-1 -->
      <!-- .data-block-2 -->
      <div class="data-block-2">
        <div>
          <h1>From</h1>
          <p>{{tx.getFrom().toString()}}</p>
        </div>
        <div>
          <div class="data-icon-container">
            <icon name='long-arrow-right'
                  scale='1'></icon> <span></span>
          </div>
          <p class="amount">{{tx.getValue().toEth()}}&nbsp;ETH</p>
        </div>
        <div>
          <h1>To</h1>
          <p>{{tx.getTo().toString()}}</p>
        </div>
      </div>
    </div>
    <!-- .data-block-loop -->
  </paginate>
  <div class="paginate-container">
    <paginate-links for="pTxs"></paginate-links>
  </div>
</div>
<!-- .standard-table-1 -->

</template>

<script lang="ts">
import Vue from 'vue'
import { Tx } from '@/libs'
import { txLayout } from '@/typeLayouts'
import sEvents from '@/configs/socketEvents.json'
import Visibility from 'visibilityjs'
import VuePaginate from 'vue-paginate'
Vue.use(VuePaginate)

export default Vue.extend({
  name: 'tx-pagination',
  props: {
    maxItems: Number,
    per: Number
  },
  data () {
    return {
      txs: [] as Array<txLayout>,
      paginate: ['pTxs']
    }
  },
  beforeMount () {
    let _this = this
    _this.$socket.emit(sEvents.pastTxs, '', (_txs) => {
      _txs.forEach((_tx) => {
        _this.txs.push(new Tx(_tx))
      })
    })
  },
  created () {
    let _this = this
    _this.$eventHub.$on(sEvents.newTx, (_tx) => {
      if (Visibility.state() === 'visible') {
        _this.txs.push(_tx)
      }
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.newTx)
  },
  computed: {
    transactions () {
      if (this.txs.length > this.maxItems) this.txs = this.txs.slice(0, this.maxItems)
      return this.txs
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
