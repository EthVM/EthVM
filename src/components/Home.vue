<template>
  <div class="frontpage">
    <Header></Header>
    <div class="section container">
      <div class="block-container row">
        <div class="three-block">
          <div class="col-md-4">
            <div class="block">
              <p class="block-title">Latest Transaction<icon name='language' scale='1'></icon></p>
              <p class="block-data">Hash number: 83402435203952130</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="block">
              <p class="block-title">Latest Block</p>
              <p class="block-data">Height: 20</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="block">
              <p class="block-title">Hash Rate</p>
              <p class="block-data">Rate: 20%</p>
            </div>
          </div>
        </div>
      </div>
      <hp-tx-container></hp-tx-container>
      <div class="block-container row">
        <div class="single-block">
          <div class="col-md-12">
            <div class="block">
              <p class="block-title">Latest Blocks</p>
              <div class="block-table">
                <table>
                  <thead>
                    <tr>
                      <td>Height</td>
                      <td>Age</td>
                      <td>Transactions</td>
                      <td>Total Sents</td>
                      <td>Size</td>
                      <td>Weight</td>
                      <td>Relayed by</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                    <tr>
                      <td>9821749182749128</td>
                      <td>12</td>
                      <td>12</td>
                      <td>$5555</td>
                      <td>41324</td>
                      <td>$3000</td>
                      <td>David</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- .block -->
          </div>
        </div>
        <!-- .single-block -->
      </div>
      <!-- .block-container -->
    </div>
    <!-- .container -->
    <div class="section container">
      <div class="block-container row">
        <div class="two-block">
          <div class="user-note-block col-md-6">
            <div class="block">
              <p class="block-title">NEW TO DIGITAL CURRENCIES?</p>
              <p class="block-data">
                Like paper money and gold before it, bitcoin and ether allow parties to exchange value. Unlike their predecessors, they are digital and decentralized. For the first time in history, people can exchange value without intermediaries which translates to greater control of funds and lower fees.
              </p>
            </div>
            <!-- .block -->
          </div>
          <div class="search-block col-md-6">
            <div class="block">
              <p class="block-title">Search</p>
              <p class="search-text">You may enter a block height, address, block hash, transaction hash, hash160, or ipv4 address...</p>
              <input class="form-control" type="search" value="Search" id="example-search-input">
              <button type="button" class="btn btn-primary">Search</button>
            </div>
          </div>
        </div>
        <!-- .two-block -->
      </div>
    </div>
    <div class="section container">
      <div class="block-container row">
        <div class="two-block">
          <div class="col-md-6">
            <div class="block">
              <p class="block-title">1 BTC = $9225.34</p>
              <p class="block-data">Interactive Chart <i class="fa fa-arrow-right" aria-hidden="true"></i></p>
            </div>
            <!-- .block -->
          </div>
          <div class="col-md-6">
            <div class="block">
              <p class="block-title">TRANSACTIONS PER DAY</p>
              <p class="block-data-b">3,437,345,992</p>
              <p class="block-title">MARKET CAP</p>
              <p class="block-data-b">$9,437,345,992</p>
              <p class="block-title">HASH RATE</p>
              <p class="block-data-b">30,437,345 TH/s</p>
            </div>
            <!-- .block -->
          </div>
        </div>
        <!-- .two-block -->
      </div>
    </div>
    <!--
      <img src="../assets/logo.png">
      <h1>{{ msg }}</h1>
      <h2>Essential Links</h2>
      <ul>
        <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
        <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
        <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
        <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
        <br>
        <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
      </ul>
      <h2>Ecosystem</h2>
      <ul>
        <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
        <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
        <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
        <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
      </ul>
      <button v-on:click="increment">Test</button>
      <h2>{{store.getters.getCount}}</h2>
      <h2 v-html="$t('hello')"></h2>
      <h3>Test</h3>
      -->
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import store from '@/states'
  export default Vue.extend({
    name: 'FrontPage',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        store: store
      }
    },
    methods: {
      increment () {
        store.commit('incrementCount')
        this.$toasted.show(store.getters.getCount)
      }
    },
    mounted: function () {
      console.log('Page is fully loaded!!!')
    }

  })
</script>
<style scoped lang="less">
  @import "~lessPath/frontpage.less";
</style>