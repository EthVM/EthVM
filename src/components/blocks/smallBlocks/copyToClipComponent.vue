<template>
  <i class="fa fa-copy copy" v-on:click="copyToClip(valueToCopy)"></i>
</template>
<script lang="ts">
import Vue from 'vue'
import copyClip from 'clipboard-copy'
export default Vue.extend({
  props: {
    valueToCopy: String
  },
  data: function() {
    return {}
  },
  methods: {
    copyToClip(newVar) {
      var status = copyClip(newVar)
      if(status){
      	console.log("Copied: " + newVar)
      }
      else {
      	console.log("Could not copy")
      }
    }
  }
})
</script>
<style scoped lang="less">
@import "~lessPath/sunil/blocks/smallBlocks/component.less";
</style>
