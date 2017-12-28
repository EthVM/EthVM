<template>
<div class="standard-table-1">
  <p class="table-title">
    <icon name='refresh'
          scale='1'></icon> Latest Transactions</p>


    <paginate name="txs" :list="tableData" :per="100">
      <!-- FOR LOOP -->
      <div class="data-block-loop"
           v-for="tx in paginated('txs')"
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



        <!-- .data-block-2 -->
        <!--sub txs -->
        <!--  <div class="data-block-sub" hidden>
          <div v-for="transfer in tx.getTrace().transfers"
               v-if="tx.getTrace() && transfer.value != '0x'">
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
        </div> -->
        <!--sub txs -->





      </div>
      <!-- .data-block-loop -->
    </paginate>

    <div class="paginate-container">
      <paginate-links for="txs"></paginate-links>
    </div>

</div>
<!-- .standard-table-1 -->

</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import { common, Tx } from '@/libs'

import VuePaginate from 'vue-paginate'
Vue.use(VuePaginate)

export default Vue.extend({
  name: 'block-container',
  props: [
    'maxItems'
  ],
  data () {
    return {
      store: store,
      txSplice: [],
      common: common,
      txs: null,
      tableData: [],
      paginate: ['txs']
    }
  },
  mounted () {
    let _this = this

    this.$store.subscribe((mutation, state) => {
      console.log(mutation)
      if (mutation.type === 'NEW_TX') {
        if (Array.isArray(mutation.payload)) {
          mutation.payload.forEach((_tx) => {
            _this.tableData.push(new Tx(_tx))
          })
        } else {
          _this.tableData.push(new Tx(mutation.payload))
        }
      }
    })

    this.$nextTick(function () {
      this.$socket.emit('pastData', '')
    }
    )
  },
  computed: {
    transactions () {
      console.log('=====> Running')
      return store.getters.getTxs.slice(0, this.maxItems)
    }
  }

})
</script>

<style lang="less" scoped>
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
