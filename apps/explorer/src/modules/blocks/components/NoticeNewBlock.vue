<template>
  <v-layout wrap row justify-space-between fill-height v-if="display">
    <h2>New Block!</h2>
    <v-btn color="info" @click="onReload">Reload</v-btn>
  </v-layout>
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
          this.display = true
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
