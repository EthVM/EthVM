<template>
  <div id="component" v-bind:class="blockname">
    <p class="block-title">{{title}}</p>
    <div class="small-bottom-block">
        <p class="small-block-value">{{value}}</p>
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'BlockComponent',
    props: ['title', 'value', 'iconName', 'iconColor'],
    data: function () {
      return {
      }
    },
    computed:{
      blockname(){
        return this.title.toLowerCase().replace(/\s/g, '').replace("/", "");
      }
    }
  })
</script>
<style scoped lang="less">
  @import "~lessPath/sunil/blocks/smallBlocks/component.less";
</style>
