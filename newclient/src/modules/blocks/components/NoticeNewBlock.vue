<template>
    <v-btn v-if="display" class="new-block-alert text-capitalize ma-0" flat @click="onReload">
        {{ buttonText }}
        <v-icon class="ml-2 secondary--text fas fa-sync small-global-icon-font"></v-icon>
    </v-btn>
</template>

<script lang="ts">
import { Mixins, Component, Prop, Watch } from 'vue-property-decorator'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'
import { newBlock } from '@app/modules/blocks/blocks.graphql'
import { TranslateResult } from 'vue-i18n'

@Component
export default class NoticeNewBlock extends Mixins(NewBlockSubscription) {
    /*
    ===================================================================================
      Props:
    ===================================================================================
  */
    @Prop({ type: String, default: 'block' }) pageId!: string // Ids: block, uncles, txs, pending

    /*
    ===================================================================================
      Data:
    ===================================================================================
  */
    display: boolean = false
    countTotal: number = 0
    newTxsCount: number = 0
    newUncles: number = 0
    validID = ['block', 'tx', 'pending', 'uncle']
    valueString: number = 0

    /*
    ===================================================================================
      Lifecycle:
    ===================================================================================
  */

    mounted() {
        //Check for valid ids:
        if (!this.validID.includes(this.pageId)) {
            throw new Error('Invalid pageId for notice new block component: ' + this.pageId)
        }
    }

    /*
    ===================================================================================
      Watch:
    ===================================================================================
  */

    @Watch('newBlockNumber')
    onNewBlockNumberChange(newVal: number, oldVal: number): void {
        if (this.pageId === this.validID[0] && this.newBlockNumber) {
            this.display = true
            this.countTotal++
            this.valueString = this.countTotal
        }
        if (this.pageId === this.validID[1] && this.newTxs && this.newTxs > 0) {
            this.display = true
            this.newTxsCount += this.newTxs
            this.valueString = this.newTxs
        }
        if (this.pageId === this.validID[3] && this.newUncles > 0) {
            this.display = true
            this.valueString = this.newUncles
        }
    }
    /*
    ===================================================================================
      Methods:
    ===================================================================================
  */
    /**
     * Reloads everything and emit's reload to parent
     */
    onReload() {
        this.$emit('reload')
        this.display = false
        this.countTotal = 0
        this.newTxsCount = 0
        this.newUncles = 0
    }

    /*
    ===================================================================================
      Computed:
    ===================================================================================
  */

    get buttonText(): String {
        const plural = this.countTotal === 1 ? 1 : 2
        const message = `message.update.${this.pageId}`
        return `${this.valueString} ${this.$tc(message, plural)}`
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
