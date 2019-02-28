<template>
  <v-container pa-0 ma-0>
    <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
      <v-flex xs6 sm2 order-xs1>
        <router-link class="black--text pb-1" :to="'/block/' + block.getHash()">{{ block.getNumber() }}</router-link>
      </v-flex>
      <v-flex xs12 sm7 md6 lass="pr-0" order-xs3 order-sm2>
        <p class="text-truncate info--text psmall mb-0 pb-0">
          {{ $t('common.hash') }}:
          <router-link class="primary--text font-italic font-weight-regular" :to="'/block/' + block.getHash()">{{ block.getHash() }}</router-link>
        </p>
        <p v-if="pageType != 'address'" class="text-truncate info--text mb-0 pt-2">
          {{ $t('block.miner') }}:
          <router-link :to="'/address/' + block.getMiner().toString()" class="secondary--text font-italic font-weight-regular">{{
            block.getMiner().toString()
          }}</router-link>
        </p>
      </v-flex>
      <v-flex hidden-sm-and-down md2 order-xs4 order-sm3>
        <p class="txSuccess--text mb-0 psmall">{{ successfulTxs() }}</p>
        <p class="txFail--text mb-0">{{ failedTxs() }}</p>
      </v-flex>
      <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
        <p class="text-truncate black--text align-center mb-0">
          <v-tooltip v-if="!isShortValue(block.getTotalReward().toEth())" bottom>
            <template #activator="data">
              <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
            </template>
            <span>{{ block.getTotalReward().toEth() }}</span>
          </v-tooltip>
          {{ getShortValue(block.getTotalReward().toEth()) }}
        </p>
      </v-flex>
    </v-layout>
    <v-layout row v-if="hasUncles(block)" pl-3 pr-2 pt-0 pb-1>
      <v-flex d-flex hidden-xs-only sm2 pt-0 pr-0> <v-img v-if="hasUncles(block)" :src="require('@/assets/uncle.png')" height="30px" contain /> </v-flex>
      <v-flex xs12 sm7 md6>
        <v-card flat color="uncleGrey">
          <v-card-title class="pt-1 font-weight-medium pb-2">{{ $t('title.uncles') }}:</v-card-title>
          <v-card-text v-for="(uncle, index) in block.getUncles()" :key="index" class="text-truncate info--text pt-0 pb-2">
            {{ $t('common.hash') }}:
            <router-link :to="'/uncle/' + uncle.getHash()">{{ uncle.getHash() }}</router-link>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex hidden-xs-only sm3 md4 />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Block, SimpleBlock, Tx, SimpleTx } from '@app/core/models'

@Component
export default class TableBlocksRow extends Mixins(StringConcatMixin) {
  @Prop({ type: String, default: 'home' }) pageType!: string
  @Prop(Object) block!: Block | SimpleBlock

  // Methods
  hasUncles(block) {
    return block.getUncles().length > 0
  }

  successfulTxs() {
    const txs: any[] = this.block.getTxs()
    return txs.filter((t: Tx | SimpleTx) => t.getStatus() === true).length
  }

  failedTxs() {
    const failed = this.block.getTxs().length - this.successfulTxs()
    return failed < 0 ? 0 : failed
  }
}
</script>
