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
            <li><a href="/blocks">Blocks</a></li>
            <li><a href="/transactions">Transactions</a></li>
            <li><a href="/pending">Pending Transactions</a></li>
            <li><a href="/charts">Charts</a></li>
          </ul>
        </div>
        <div class="col-md-2">
          <h5>Find Us</h5>
          <p><a href="mailto:support@ethvm.com">support@ethvm.com</a></p>
        </div>
        <div class="col-md-6">
          <div class="input-block hidden">
            <h5>Connect With Us</h5>
            <input type="text" name="email" placeholder="Your email address">
            <button v-on:click="signupButton">Sign Up</button>
          </div>

          <div class="input-block">
            
            <h5>Connect With Us</h5>

            <!-- Begin MailChimp Signup Form -->
            <div id="mc_embed_signup">
              <form action="https://ethvm.us12.list-manage.com/subscribe/post?u=3f151389cc45ad83e9bbb41ed&amp;id=bd3f611f67" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                <div id="mc_embed_signup_scroll">
                  <div class="mc-field-group">
                    <input placeholder="Your email address" type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
                  </div>
                  <div id="mce-responses" class="clear">
                    <div class="response" id="mce-error-response" style="display:none"></div>
                    <div class="response" id="mce-success-response" style="display:none"></div>
                  </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                  <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_3f151389cc45ad83e9bbb41ed_bd3f611f67" tabindex="-1" value=""></div>
                  <div class="clear signup-submit"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
                </div>
              </form>
            </div>

            <!--End mc_embed_signup-->

            
          </div>

          <div class="input-block">
            <h5>Donate <span>Etherium Wallet</span></h5>
            <input type="text" name="email" placeholder="0x829bd824b016326a401d083b33d092293333a830">
            <button v-on:click="donateButton">Donate</button>
          </div>
        </div>
      </div>
      <p class="copy-right">©Copyright 2018 All rights reserved by <a href="/about" class="text-white">Ethereum Virtual Machine</a>.</p>
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
