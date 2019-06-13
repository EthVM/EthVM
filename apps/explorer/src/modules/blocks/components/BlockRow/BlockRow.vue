<template>
  <div class="table-content">
    <table>
      <!--
      =====================================================================================
        TABLE HEADER
      =====================================================================================
      -->
      <thead>
        <tr>
          <td>{{ $t('block.number') }}</td>
          <td>Hash & Miner</td>
          <td>{{ $tc('tx.name', 2) }}</td>
          <td>{{ $t('miner.reward-short') }}</td>
        </tr>
      </thead>
      <!--
      =====================================================================================
        TABLE BODY
      =====================================================================================
      -->
      <tbody>
        <tr v-for="(block, index) in blocks" :key="index">
          <td>
            <router-link :to="`/block/${block.hash}`">{{ block.numberBN }}</router-link>
          </td>
          <td>
            <div class="flax-row hash">
              <p class="value-name">{{ $t('common.hash') }}:</p>
              <app-transform-hash :hash="block.hash" :link="`/block/${block.hash}`" />
            </div>
            <div class="flax-row miner">
              <p class="value-name">{{ $t('miner.name') }}:</p>
              <app-transform-hash :hash="block.author" :italic="true" :link="`/address/${block.author}`" />
            </div>
            <div v-if="block.uncleHashes.length" class="uncle-block">
              <div>{{ $tc('uncle.name', 2) }}:</div>
              <div v-for="(uncle, index) in block.uncleHashes" :key="index" class="flax-row">
                <p class="value-name">{{ $t('common.hash') }}:</p>
                <app-transform-hash :hash="uncle" :link="`/uncle/${uncle}`" />
              </div>
            </div>
          </td>
          <td>
            <div class="transactions">
              <p>{{ block.numSuccessfulTxsBN }} {{ $tc('tx.name-short', sucessTransalate()) }}</p>
              <p v-if="block.numFailedTxsBN > 0" class="tx-failed">{{ block.numFailedTxsBN }} {{ $tc('tx.failed', failedTranslate()) }}</p>
            </div>
          </td>
          <td>
            <p class="">{{ getRoundNumber(ethValue(block.rewardBN).toEth()) }}</p>
          </td>
        </tr>
      </tbody>
    </table>
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
@import 'BlockRow';
</style>
