<template>
  <v-btn flat class="new-block-alert text-capitalize ma-0" @click="onReload" v-if="display">
    {{ buttonText }}
    <v-icon class="ml-1 secondary--text fas fa-sync fa-1x fa-rotate-90"></v-icon>
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
        },
        variables: {
          block: 0
        }
      }
    }
  }
})
export default class NoticeNewBlock extends Vue {
  /*
    ===================================================================================
      Props:
    ===================================================================================
  */
  @Prop({ type: String, default: 'block' }) pageID!: string // Ids: block, uncles, txs, pending

  /*
    ===================================================================================
      Data:
    ===================================================================================
  */
  display: boolean = false
  countTotal: number = 0

  /*
    ===================================================================================
      Lifecycle:
    ===================================================================================
  */
  mounted() {
    //Check for valid ids:
    const validID = ['block', 'tx', 'pending', 'uncle']
    if (!validID.includes(this.pageID)) {
      throw new Error('Invalid pageID for notice new block component: ' + this.pageID)
    }
  }

  /*
    ===================================================================================
      Methods:
    ===================================================================================
  */
  onReload() {
    this.$emit('reload')
    this.display = false
    this.countTotal = 0
  }


  /*
    ===================================================================================
      Computed:
    ===================================================================================
  */

  get buttonText(): String {
    const plural = this.countTotal === 1 ? 1 : 2
    const message = `message.update.${this.pageID}`
    return `${this.countTotal} ${this.$tc(message, plural)}`
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
