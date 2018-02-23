<template>
  <div class="about">
  
    <div class="row">
      <div class="col-md-12">
        <div class="content">
          <img src="~@/assets/logo-circle.png">
          <h2>What is EthVM?</h2>
          <p>EthVM project is brought to you by kvhnuke, founder of MyEtherWallet and enKrypt. EthVM is a free and open source interface for exploring and evaluting real time Ethereum blocks, transactions and more. This software is under MIT License.</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="content">
          <img src="~@/assets/github.png">
          <h2>GitHub</h2>
          <p>If you want to contribute, make a request on GitHub.</p>
          <p class="link"><a target="_blank" href="https://github.com/enKryptIO/ethvm">Take me there</a></p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="content">
          <img src="~@/assets/medium.png">
          <h2>Medium</h2>
          <p>If you want to listen/share our awesome thoughts check our medium account.</p>
          <p class="link"><a target="_blank" href="https://github.com/enKryptIO/ethvm">Take me there</a></p>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-md-12">
        <div class="content">
          <div class="icon">
            <i class="fa fa-user-circle" aria-hidden="true"></i>
          </div>
          <h2>Social</h2>
          <p>If you want to reach out to us, please do so by following one or all of these.</p>

          <div class="social-box">
            <ul>
              <li><a href=""><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
              <li><a href=""><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
              <li><a href=""><i class="fa fa-google-plus" aria-hidden="true"></i></a></li>
              <li><a href=""><i class="fa fa-tumblr" aria-hidden="true"></i></a></li>
            </ul>
            
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="content">
          <div class="icon">
            <i class="fa fa-asterisk" aria-hidden="true"></i>
          </div>
          <h2>Disclaimer</h2>
          <p>
            MIT License Copyright © 2017-2018 enKrypt LLC
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
          </p>
          <p class="disclaimer">THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
        </div>
      </div>
    </div>



  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data() {
      return {
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/sunil/blocks/largeBlocks/about.less";
</style>