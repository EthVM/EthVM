<template>
    <block-stats-module />
    <recent-blocks :max-items="10" page-type="home" />
    <module-txs :max-items="10" page-type="home" />
</template>

<script setup lang="ts">
// Components
import BlockStatsModule from '@module/block/ModuleBlockStats.vue'
import RecentBlocks from '@module/block/ModuleRecentBlocks.vue'
import ModuleTxs from '@module/txs/ModuleTxs.vue'
</script>
