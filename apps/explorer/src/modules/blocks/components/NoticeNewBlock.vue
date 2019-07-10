<template>
  <v-btn class="new-block-alert" @click="onReload" v-if="display">
    {{ buttonText }} <v-icon class="ml-1 secondary--text">autorenew</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
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

  @Prop(String) message?: string
  display: boolean = false

  onReload() {
    this.$emit('reload')
    this.display = false
  }

  get buttonText(): string {
    return this.message || 'New block'
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
