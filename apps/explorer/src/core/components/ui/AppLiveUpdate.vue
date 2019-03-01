<template>

    <v-btn v-if="update" flat class="update-btn " @click="refresh">
    <v-layout align-center justify-start row fill-height>
      <v-card-title class="text-lowercase font-weight-regular">{{formatStr(newTxs.toString())}} {{$t('message.updateTxs')}}</v-card-title>
      <v-icon class="secondary--text" small > fas fa-sync-alt</v-icon>
    </v-layout>
    </v-btn>

</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { Events, BlockMetrics } from 'ethvm-common'
import { StringConcatMixin } from '@app/core/components/mixins'

@Component
export default class AppLiveUpdate extends Mixins(StringConcatMixin) {

  lastBlock: string =  null
  update = true
  newTxs = 0
  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.$eventHub.$on(Events.NEW_BLOCK_METRIC, _ => {
      const newBlock = this.$store.getters.blockMetrics.top()
      if (newBlock) {
        console.log(this.lastBlock)
        !this.lastBlock ? this.lastBlock = newBlock.number : this.process(newBlock)
      }
    })
  }

  beforeDestroy() {
    this.$eventHub.$off([Events.NEW_BLOCK_METRIC])
  }
    /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  process(block: BlockMetrics):void {
    this.update = true
    this.lastBlock = block.number
    this.newTxs += block.totalTxs
  }

  refresh(): void {
    this.update = false
    this.$emit('refreshTable')
  }

}
</script>

<style scoped lang="css">
.update-btn{
   border: solid 1px #ffb647;
   background: #ffe7d6;
}
</style>
