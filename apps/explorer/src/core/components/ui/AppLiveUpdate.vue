<template>
  <v-btn v-if="update" block flat class="update-btn" @click="refresh">
    <v-layout align-center justify-center row wrap fill-height>
      <p class="text-lowercase font-weight-regular pr-2 mb-0">{{ text }}</p>
      <v-icon class="secondary--text" small> fas fa-sync-alt</v-icon>
    </v-layout>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { Events } from '@app/core/hub'
import { BlockMetrics } from '@app/core/models'
import { StringConcatMixin } from '@app/core/components/mixins'
import { TranslateResult } from 'vue-i18n'

@Component
export default class AppLiveUpdate extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) pageType!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  update = false
  newTxs = 0
  newBlocks = 0

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.$eventHub.$on(Events.NEW_BLOCK_METRIC, _ => {
      const newBlock = this.$store.getters.blockMetrics.top()
      if (newBlock) {
        this.process(newBlock)
      }
    })
  }

  beforeDestroy() {
    this.$eventHub.$off([Events.NEW_BLOCK_METRIC])
  }

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get initialBlock(): BlockMetrics {
    return this.$store.getters.blockMetrics.top()
  }

  get messages() {
    return {
      tx: this.$i18n.tc('message.update.tx', this.plural),
      blocks: this.$i18n.tc('message.update.block', this.plural)
    }
  }

  get text(): string {
    return `${this.formatStr(this.newNumber)} ${this.messages[this.pageType]}`
  }

  get plural(): number {
    if (this.pageType === 'blocks') {
      return this.newBlocks > 1 ? 2 : 1
    }

    return this.newTxs > 1 ? 2 : 1
  }

  get newNumber(): string {
    return this.pageType === 'blocks' ? this.newBlocks.toString() : this.newTxs.toString()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  process(block: BlockMetrics): void {
    this.update = true
    this.newBlocks++
    this.newTxs += block.totalTxs
  }

  refresh(): void {
    this.update = false
    this.newTxs = 0
    this.newBlocks = 0
    this.$emit('refreshTable')
  }
}
</script>

<style scoped lang="css">
.update-btn{
  border: solid 1px #ffb647;
  background: #ffe7d6;
  padding: 2px 2px 2px 2px;
  margin: 0px;
}

.wrap-text{
  word-wrap: break-word;
}
</style>
