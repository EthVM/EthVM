<template>
  <div class="table-content">
    <!--
      =====================================================================================
        [DESKTOP] TABLE HEADER
      =====================================================================================
      -->
    <div class="grid-table-container table-header">
      <div class="grid-block">
        <div>{{ $t('block.number') }}</div>
        <div>Hash & Miner</div>
        <div>Txn</div>
        <div>{{ $t('miner.reward-short') }}</div>
      </div>
    </div>
    <!--
      =====================================================================================
        [DESKTOP] TABLE BODY
      =====================================================================================
      -->
    <div class="grid-table-container table-body">
      <div class="grid-block" v-for="(block, index) in blocks" :key="index">
        <div>
          <router-link :to="`/block/${block.hash}`">{{ block.numberBN }}</router-link>
        </div>
        <div>
          <div class="flax-row hash-block hash">
            <p class="value-name">{{ $t('common.hash') }}:</p>
            <app-transform-hash :hash="block.hash" :link="`/block/${block.hash}`" />
          </div>
          <div class="flax-row hash-block miner">
            <p class="value-name">{{ $t('miner.name') }}:</p>
            <app-transform-hash :hash="block.author" :italic="true" :link="`/address/${block.author}`" />
          </div>
          <div v-if="block.uncleHashes.length" class="uncle-block hash-block">
            <div>{{ $tc('uncle.name', 2) }}:</div>
            <div v-for="(uncle, index) in block.uncleHashes" :key="index" class="flax-row">
              <p class="value-name">{{ $t('common.hash') }}:</p>
              <app-transform-hash :hash="uncle" :link="`/uncle/${uncle}`" />
            </div>
          </div>
        </div>
        <div>
          <div class="transactions">
            <p>{{ block.numSuccessfulTxsBN }} {{ $tc('tx.name-short', sucessTransalate()) }}</p>
            <p v-if="block.numFailedTxsBN > 0" class="tx-failed">{{ block.numFailedTxsBN }} {{ $tc('tx.failed', failedTranslate()) }}</p>
          </div>
        </div>
        <div>
          <p class="">{{ getRoundNumber(ethValue(block.rewardBN).toEth()) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { StringConcatMixin } from '@app/core/components/mixins'
import { EthValue } from '@app/core/models'
import BN from 'bignumber.js'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { BlockSummaryPageExt_items } from '@app/core/api/apollo/extensions/block-summary-page.ext'

@Component({
  components: {
    AppTransformHash
  }
})
export default class TableBlocksRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String, default: 'home' }) pageType!: string
  @Prop(Object) block!: BlockSummaryPageExt_items
  @Prop(Object) blocks!: BlockSummaryPageExt_items

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  ethValue(number: BN) {
    return new EthValue(number)
  }

  hasUncles(block) {
    return false
    // return block.getUncles().length > 0
  }

  sucessTransalate(): number {
    return this.block && this.block.numSuccessfulTxsBN!.toNumber() > 1 ? 2 : 1
  }

  failedTranslate(): number {
    return this.block && this.block.numFailedTxsBN!.toNumber() > 1 ? 2 : 1
  }
}
</script>

<style scoped lang="less">
@import 'BlockTableContent';
</style>
