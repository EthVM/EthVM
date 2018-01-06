<template>
  <div class="about">

    <div class="row">
      <div class="col-md-12">
        
        <div>
          <h4>EthVM</h4>
          <h1>Our Services</h1>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting</p>
        </div>

      </div>      
    </div>

    <div class="row">
      <div class="col-md-6">
        <img src="/img/blockchain.png">
      </div>

      <div class="col-md-6">
        <div class="features-container">
          <div class="icon">
            <icon name='hashtag' scale='1'></icon>
          </div>
          <div class="features">
            <h5>Feature 1</h5>
            <h2>Online Live Support</h2>
            <p>Lorem ipsum is simply dummy text of the printing and typesetting. Lorem Ipsum has been the industry’s standard dummy.</p>  
          </div>
          
        </div>  
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Info/InfoAbout.less";
</style>
