<template>
  
  <div class="">
    
    <div class="container">


      <div class="page-title-container">
        <div class="page-title">
          <h3>Address Overview</h3>
          <h6 class="text-muted">Ethereum wallet address overview / Transactions information</h6>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>


      <address-detail :account="account"></address-detail>



      <div class="tab-menu-container">
        <ul class="tabs">
          <li v-on:click="nav1on" v-bind:class="{ active: nav1 }">Transactions</li>
          <li v-on:click="nav2on" v-bind:class="{ active: nav2 }">Transaction History</li>
          <li v-on:click="nav3on" v-bind:class="{ active: nav3 }">Network History</li>
          <li v-on:click="nav4on" v-bind:class="{ active: nav4 }">Mining History</li>
          <li v-on:click="nav5on" v-bind:class="{ active: nav5 }">Tokens</li>

        </ul>      

        <div class="tab-content">
          <div v-if="nav1 === true" class="">            
            <block-last-transactions :transactions="txs" :showheader="true"></block-last-transactions>
          </div>
          <div v-if="nav2 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab tx-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
          <div v-if="nav3 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab net-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
          <div v-if="nav4 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab mining-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
          <div v-if="nav5 === true" class="" :account="account">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab mining-history-container">
              <ul>
                <li>Token :</li>
                
                <li v-for="token in account.tokens">
                    {{ token }}
                 </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div><!-- container -->



  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import bn from 'bignumber.js';
import { common } from '@/libs';
import ethUnits from 'ethereumjs-units'
 var utils =  require("../../libs/utils.js")




let Account = require('ethereumjs-account')

const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FrameAccount',
  props: [
    'address',
    'tokens'
  ],
  data() {
    return {
      account: {
        address: this.address,
        balance: common.EthValue(new Buffer(0)),
        tokens: this.tokens

      },

      nav1 : true,
      nav2 : false,
      nav3 : false,
      nav4 : false,     
      nav5 : false

    }
  },
  created(){
    var _this = this;
     this.$socket.emit('getBalance', this.address, (err, result) => {
      console.log(err, result)
      if (!err && result) {
         _this.account.balance =   ethUnits.convert(new bn(parseInt(result.result,16) ).toFixed(), 'wei', 'eth')
       }
    })

    this.$socket.emit('getTokenBalance', this.address, (err, result) => {
      console.log(err, result)
       _this.account.tokens = utils.decode(result.result)
    })
  },
  methods: {
    alloff(){
      this.nav1 = false
      this.nav2 = false
      this.nav3 = false
      this.nav4 = false
      this.nav5 = false
    },

    nav1on(){
      this.alloff()
      this.nav1 = true
    },

    nav2on(){
      this.alloff()
      this.nav2 = true
    },

    nav3on(){
      this.alloff()
      this.nav3 = true
    },

    nav4on(){
      this.alloff()
      this.nav4 = true
    },

    nav5on(){
      this.alloff()
      this.nav5 = true
    }
  },
  computed:{
    txs(){
        if(this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
        else return []
    }
  }

})

</script>

<style scoped="" lang="less">
  @import "~lessPath/sunil/frames/address.less";
</style>
