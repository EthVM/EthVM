<template>
  <div id="footer">

    <block-modal :modal-status="signup" @modalDisabled="signup = $event"></block-modal>

    <div class="container">
      <div class="row">
        <div class="col-md-2">
          <h5>About Us</h5>
          <p>EthVM project is brought to you by kvhnuke, founder of MyEtherWallet and enKrypt. EthVM is a free and open source  interface for exploring and evaluating real time Ethereum blocks, transactions and more.</p>

          <div class="social-buttons">
            <a href="https://www.facebook.com/enKryptIO/" target="_blank"><i class="fa fa-facebook-f"></i></a>
            <a href="https://twitter.com/enkryptio" target="_blank"><i class="fa fa-twitter"></i></a>
            <a href="https://github.com/enKryptIO" target="_blank"><i class="fa fa-github"></i></a>
          </div>
        </div>
        <div class="col-md-2">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#">Last Blocks</a></li>
            <li><a href="#">Latest Transactions</a></li>
            <li><a href="#">Pending Transactions</a></li>
            <li><a href="#">Charts</a></li>
          </ul>
        </div>
        <div class="col-md-2">
          <h5>Find Us</h5>
          <p>Los Angeles, CA, USA</p>
          <p>Ph. 213-123-4567</p>
          <p>E: <a href="mailto:support@ethvm.com">support@ethvm.com</a></p>
        </div>
        <div class="col-md-6">
          <div class="input-block">
            <h5>Connect With Us</h5>
            <input type="text" name="email" placeholder="Your email address">
            <button v-on:click="signupButton">Sign Up</button>
          </div>
          <div class="input-block">
            <h5>Donate <span>Etherium Wallet</span></h5>
            <input type="text" name="email" placeholder="0x829bd824b016326a401d083b33d092293333a830">
            <button v-on:click="donateButton">Donate</button>
          </div>
        </div>
      </div>
      <p class="copy-right">©Copyright 2018 All rights reserved by <a href="#" class="text-white">Ethereum Virtual Machine</a>.</p>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  Vue.component('modal', {
    template: '#modal-template'
  })
  export default Vue.extend({
    data () {
      return {
        signup : false
      }
    },
    methods: {
      donateButton: function(){
        console.log('Donation to ethvm')

      },
      signupButton: function(){
        //console.log('Email signup')
        this.signup = true;
        console.log('Email signup: ' + this.signup)

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/sunil/blocks/footer/footer.less";
</style>
