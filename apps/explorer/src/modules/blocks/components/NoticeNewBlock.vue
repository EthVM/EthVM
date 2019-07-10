<template>
  <v-btn class="new-block-alert" @click="onReload" v-if="display">
    New block <v-icon class="ml-1 secondary--text">autorenew</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { newBlock } from '@app/modules/blocks/blocks.graphql'

@Component({
  apollo: {
    $subscribe: {
      newBlock: {
        query: newBlock,

        result({ data }) {
          (this as any).display = true
        }
      }
    }
  }
})
export default class NoticeNewBlock extends Vue {
  display: boolean = false

  onReload() {
    this.$emit('reload')
    this.display = false
  }
}
</script>

<style scoped lang="css">
  .new-block-alert {
    width: 202px;
    height: 44px;
    border: solid 1px #ffb647;
    background-color: rgba(254, 217, 161, 0.25) !important;
    text-transform: none !important;
  }
</style>
