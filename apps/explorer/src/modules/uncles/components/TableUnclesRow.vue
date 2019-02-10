<template>
  <v-container pa-0 ma-0>
    <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
      <v-flex xs6 sm2 order-xs1>
        <router-link class="black--text pb-1" :to="'/uncle/' + uncle.getHash()">{{ uncle.getBlockHeight() }}</router-link>
      </v-flex>
      <v-flex xs12 sm7 md6 lass="pr-0" order-xs3 order-sm2>
        <p class="text-truncate info--text psmall mb-0 pb-0">
          {{ $t('common.hash') }}:
          <router-link class="primary--text font-italic font-weight-regular" :to="'/uncle/' + uncle.getHash()">{{ uncle.getHash() }}</router-link>
        </p>
        <p v-if="pageType != 'address'" class="text-truncate info--text mb-0 pt-2">
          {{ $t('block.miner') }}:
          <router-link :to="'/address/' + uncle.getMiner().toString()" class="secondary--text font-italic font-weight-regular">{{
            uncle.getMiner().toString()
          }}</router-link>
        </p>
      </v-flex>
      <v-flex hidden-sm-and-down md2 order-xs4 order-sm3>
        <p class="txSuccess--text mb-0 psmall">{{ uncle.getPosition() }}</p>
      </v-flex>
      <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
        <p class="text-truncate black--text align-center mb-0">
          <v-tooltip v-if="!isShortValue(uncle.getTotalReward().toEth())" bottom>
            <v-icon slot="activator" dark small>fa fa-question-circle info--text</v-icon>
            <span>{{ uncle.getTotalReward().toEth() }}</span>
          </v-tooltip>
          {{ getShortValue(uncle.getTotalReward().toEth()) }}
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Uncle } from '@app/core/models'

@Component
export default class TableUnclesRow extends Mixins(StringConcatMixin) {
  @Prop(Object) uncle!: Uncle
  @Prop({ type: String, default: 'home' }) pageType!: string
}
</script>
