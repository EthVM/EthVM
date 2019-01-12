<template>
  <v-container pa-0 ma-0>
    <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
      <v-flex xs6 sm2 order-xs1 v-if="block.getType() == 'block'">
        <router-link class="black--text pb-1" :to="'/block/' + block.getHash()">{{ block.getNumber() }}</router-link>
      </v-flex>
      <v-flex xs6 sm2 order-xs1 v-if="block.getType() == 'uncle'">
        <router-link class="black--text pb-1" :to="'/uncle/' + block.getHash()">{{ block.getNumber() }}</router-link>
      </v-flex>
      <v-flex xs12 sm7 md6 lass="pr-0" order-xs3 order-sm2>
        <p v-if="block.getType() == 'block'" class="text-truncate info--text psmall mb-0 pb-0">
          {{ $t('common.hash') }}:
          <router-link class="primary--text font-italic font-weight-regular" :to="'/block/' + block.getHash()">{{ block.getHash() }}</router-link>
        </p>
        <p v-else class="text-truncate info--text psmall mb-0 pb-0">
          {{ $t('common.hash') }}:
          <router-link class="primary--text font-italic font-weight-regular" :to="'/uncle/' + block.getHash()">{{ block.getHash() }}</router-link>
        </p>
        <p v-if="pageType != 'address'" class="text-truncate info--text mb-0 pt-2">
          {{ $t('block.miner') }}:
          <router-link :to="'/address/' + block.getMiner().toString()" class="secondary--text font-italic font-weight-regular">{{
            block.getMiner().toString()
          }}</router-link>
        </p>
      </v-flex>
      <v-flex v-if="block.getType() == 'block'" hidden-sm-and-down md2 order-xs4 order-sm3>
        <p class="txSuccess--text mb-0 psmall">{{ block.getStats().successfulTxs }}</p>
        <p class="txFail--text mb-0">{{ block.getStats().failedTxs }}</p>
      </v-flex>
      <v-flex v-if="block.getType() == 'uncle'" hidden-sm-and-down md2 order-xs4 order-sm3>
        <p class="txSuccess--text mb-0 psmall">{{ block.getPosition() }}</p>
      </v-flex>
      <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
        <p class="text-truncate black--text align-center mb-0">
          <v-tooltip v-if="getShortValue(block.getTotalReward(), true)" bottom>
            <v-icon slot="activator" dark small>fa fa-question-circle info--text</v-icon>
            <span>{{ block.getTotalReward() }}</span>
          </v-tooltip>
          {{ getShortValue(block.getTotalReward(), false) }}
        </p>
      </v-flex>
    </v-layout>
    <v-layout row v-if="hasUncles(block)" pl-3 pr-2 pt-0 pb-1>
      <v-flex d-flex hidden-xs-only sm2 pt-0 pr-0> <v-img v-if="hasUncles(block)" :src="require('@/assets/uncle.png')" height="30px" contain></v-img> </v-flex>
      <v-flex xs12 sm7 md6>
        <v-card flat color="uncleGrey">
          <v-card-title class="pt-1 font-weight-medium">Uncles:</v-card-title>
          <v-card-text v-for="(uncle, index) in block.getUncles" :key="index" class="text-truncate info--text">
            {{ $t('common.hash') }}:
            <router-link :to="'/block/' + uncle.unclesHash">{{ uncle.unclesHash }}</router-link>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex hidden-xs-only sm3 md4></v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/components/core/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Block } from '@app/models'

@Component
export default class TableBlocksRow extends Mixins(StringConcatMixin) {
  @Prop(Object) block!: Block
  @Prop({ type: String, defualt: 'home' }) pageType!: string

  hasUncles(block) {
    return block.getType() == 'block' && block.getUncles.length > 0
  }
}
</script>
