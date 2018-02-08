<template>
    <div class="small-block component-shadow">
        <p class="small-block-title">{{title}}</p>
        <div class="small-bottom-block ">
            <div class="small-block-icon">
                <icon :name="iconName" scale='1.3' :color="iconColor"></icon>
            </div>
            <p class="small-block-value">{{value}}</p>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SmallBlockComponent',
  props: ['title', 'value', 'iconName', 'iconColor'],
  data: function () {
    return {

    }
  }
})
</script>
<style scoped lang="less">
  @import "~lessPath/sunil/blocks/smallBlocks/smallBlockComponent.less";
</style>
