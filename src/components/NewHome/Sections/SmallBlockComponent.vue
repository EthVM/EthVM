<template>
    <div id="SmallBlock">
        <p class="block-title">{{title}}</p>
        <div class="bottom-block">
            <div class="icon-block">
                <icon name="icon-name" scale='1.5'></icon>
            </div>
            <p class="block-value">{{value}}</p>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SmallBlockComponent',
  props: ['title', 'value', 'icon-name'],
  data: function () {
    return {

    }
  }
})
</script>
<style scoped lang="less">
@import "~lessPath/NewHome/Sections/ShortData/ShortDataDifficulty.less";
</style>
