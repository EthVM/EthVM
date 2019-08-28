<template>
  <v-btn flat class="new-block-alert text-capitalize  ma-0" @click="onReload" v-if="display">
    {{ buttonText }} <v-icon class="ml-1 secondary--text fas fa-sync fa-1x fa-rotate-90"></v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { newBlock } from '@app/modules/blocks/blocks.graphql'
import { TranslateResult } from 'vue-i18n'

@Component({
  apollo: {
    $subscribe: {
      newBlock: {
        query: newBlock,

        result({ data }) {
          ;(this as any).display = true
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

  get buttonText(): TranslateResult {
    return this.message || this.$tc('message.update.block', 1)
  }
}
</script>

<style scoped lang="css">
.new-block-alert {
  height: 44px;
  border: solid 1px #ffb647;
  background-color: rgba(254, 217, 161, 0.25) !important;
}
</style>
