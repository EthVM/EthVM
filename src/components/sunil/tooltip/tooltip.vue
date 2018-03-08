<template>
  <div  class="tooltip-container">
    <i class="fa fa-question-circle" v-on:mouseover="show" v-on:mouseleave="hide">
      <transition name="fade" mode="out-in">
        <div  v-if="showToolTip" class="tooltip-text">
          <p>{{textToolTip}}</p>
        </div>
      </transition>
    </i>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'tooltip',
  data() {
    return {
      showToolTip: false,
    }
  },
  props: {
    textToolTip: String,   
  },
  methods:{
    show() {
      this.showToolTip = true
    },
    hide() {
      this.showToolTip = false
    }  
  }
})
</script>


<style scoped lang="less">
  @import "~lessPath/sunil/tooltip/tooltip.less";
</style>


