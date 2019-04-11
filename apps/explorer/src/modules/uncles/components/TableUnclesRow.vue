<template>
  <v-container pa-0 ma-0>
    <v-layout d-block>
      <!--
      =====================================================================================
        Mobile (XS)
      =====================================================================================
      -->
      <v-flex xs12 hidden-sm-and-up>
        <div class="table-row-mobile">
          <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-4 pl-4">
            <v-flex xs6 pa-1>
              <p class="black--text font-weight-medium">{{ $t('uncle.number') }}</p>
            </v-flex>
            <v-flex xs6 pr-44>
              <v-layout row justify-end>
                <router-link class="linkBlue--text font-weight-medium pr-2" :to="`/uncle/${uncle.getHash()}`">{{ uncle.getNumber() }}</router-link>
              </v-layout>
            </v-flex>
            <v-flex xs12 pa-1>
              <v-layout pr-2>
                <v-flex shrink>
                  <p class="info--text psmall">{{ $t('common.hash') }}:</p>
                </v-flex>
                <v-flex xs10>
                  <app-hash-concat :hash="uncle.getHash()" :link="`/uncle/${uncle.getHash()}`" />
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 pa-1>
              <v-layout pr-2>
                <v-flex shrink>
                  <p class="info--text psmall">{{ $t('miner.name') }}:</p>
                </v-flex>
                <v-flex xs10>
                  <app-hash-concat :hash="uncle.getMiner().toString()" :link="`/address/${uncle.getMiner().toString()}`" />
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 pa-1>
              <p class="info--text psmall">
                {{ $t('uncle.included') }}:<router-link class="secondary--text pl-1" :to="`/block/${uncle.getBlockHeight()}`">{{
                  uncle.getBlockHeight()
                }}</router-link>
              </p>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>

      <v-flex xs12 hidden-xs-only>
        <!--
      =====================================================================================
        Desktop (Sm-And-Up)
      =====================================================================================
      -->
        <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
          <v-flex xs3 sm2 order-xs1>
            <router-link class="secondary--text pb-1" :to="`/block/${uncle.getBlockHeight()}`">{{ uncle.getBlockHeight() }}</router-link>
          </v-flex>
          <v-flex xs3 sm2 order-xs1>
            <router-link class="secondary--text pb-1" :to="`/uncle/${uncle.getHash()}`">{{ uncle.getNumber() }}</router-link>
          </v-flex>
          <v-flex xs12 sm5 md5 order-xs3 order-sm2>
            <v-layout row pl-2 pt-2 pr-3 pb-0>
              <p class="info--text psmall pr-2">{{ $t('common.hash') }}:</p>
              <app-hash-concat :hash="uncle.getHash()" :link="`/uncle/${uncle.getHash()}`" />
            </v-layout>
            <v-layout row pl-2 pt-2 pr-3 pb-2>
              <p class="info--text psmall pr-2">{{ $tc('miner.name', 1) }}:</p>
              <app-hash-concat :hash="uncle.getMiner().toString()" :link="`/address/${uncle.getMiner().toString()}`" />
            </v-layout>
          </v-flex>
          <v-flex hidden-sm-and-down md1 order-xs4 order-sm3>
            <p class="txSuccess--text mb-0 psmall">{{ uncle.getPosition() }}</p>
          </v-flex>
          <v-flex d-flex xs6 sm3 md2 order-xs2 order-md4>
            <p class="text-truncate black--text align-center mb-0">
              <v-tooltip v-if="!isShortValue(uncle.getTotalReward().toEth())" bottom>
                <template #activator="data">
                  <v-icon v-on="data.on" dark small>fa fa-question-circle info--text</v-icon>
                </template>
                <span>{{ uncle.getTotalReward().toEth() }}</span>
              </v-tooltip>
              {{ getShortValue(uncle.getTotalReward().toEth()) }}
            </p>
          </v-flex>
        </v-layout>
        <v-divider class="mb-2 mt-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Uncle } from '@app/core/models'
import AppHashConcat from '@app/core/components/ui/AppHashConcat.vue'

@Component({
  components: {
    AppHashConcat
  }
})
export default class TableUnclesRow extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(Object) uncle!: Uncle
  @Prop({ type: String, default: 'home' }) pageType!: string
}
</script>

<style scoped lang="css">

.table-row-mobile {
  border: 1px solid #b4bfd2;
}

p {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
