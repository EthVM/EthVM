<template>
  <v-container pa-0>
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
              <router-link class="black--text font-weight-medium pb-1" :to="`/block/${block.getHash()}`"
                >{{ $t('block.number') }} {{ block.getNumber() }}</router-link
              >
            </v-flex>
            <v-flex xs6 pr-44>
              <v-layout row justify-end>
                <p>{{ successfulTxs() }} {{ $tc('tx.name-short', sucessTransalate()) }}</p>
                <p v-if="failedTxs() > 0" class="txFail--text pl-1 ">({{ failedTxs() }} {{ $tc('tx.failed', failedTranslate()) }})</p>
              </v-layout>
            </v-flex>
            <v-flex xs2 pa-1>
              <p class="info--text psmall">{{ $t('common.hash') }}:</p>
            </v-flex>
            <v-flex xs10 pa-1>
              <app-transform-hash :hash="block.getHash()" :link="`/block/${block.getHash()}`" />
            </v-flex>
            <v-flex xs2 pa-1>
              <p class="info--text psmall pr-1">{{ $t('miner.name') }}:</p>
            </v-flex>
            <v-flex xs10 pa-1>
              <app-transform-hash :hash="block.getMiner().toString()" :italic="true" :link="`/address/${block.getMiner().toString()}`" />
            </v-flex>
            <v-flex xs2 pa-1>
              <p class="info--text psmall">{{ $t('miner.reward-short') }}:</p>
            </v-flex>
            <v-flex xs10 pa-1>
              <p class="black--text align-center pl-2">{{ getRoundNumber(block.getTotalReward().toEth()) }}</p>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <!--
      =====================================================================================
        Tablet/ Desktop (SM - XL)
      =====================================================================================
      -->
      <v-flex hidden-xs-only sm12>
        <!--
        =====================================================================================
          Block Info
        =====================================================================================
        -->
        <v-layout grid-list-xs row wrap align-center justify-start fill-height pl-3 pr-2 pt-2 pb-1>
          <v-flex sm2>
            <router-link class="black--text pb-1" :to="`/block/${block.getHash()}`">{{ block.getNumber() }}</router-link>
            <div v-if="hasUncles(block)" class="arrow">
              <div class="line"></div>
            </div>
          </v-flex>
          <v-flex sm6>
            <v-layout row pb-2>
              <p class="info--text psmall pr-2">{{ $t('common.hash') }}:</p>
              <app-transform-hash :hash="block.getHash()" :link="`/block/${block.getHash()}`" />
            </v-layout>
            <v-layout row>
              <p class="info--text pr-1">{{ $t('miner.name') }}:</p>
              <app-transform-hash :hash="block.getMiner().toString()" :italic="true" :link="`/address/${block.getMiner().toString()}`" />
            </v-layout>
          </v-flex>
          <v-spacer hidden-xl-only />
          <v-flex sm2>
            <v-layout row wrap>
              <p class="pr-1">{{ successfulTxs() }} {{ $tc('tx.name-short', sucessTransalate()) }}</p>
              <p v-if="failedTxs() > 0" class="txFail--text">({{ failedTxs() }} {{ $tc('tx.failed', failedTranslate()) }})</p>
            </v-layout>
          </v-flex>
          <v-flex sm1 xl2>
            <p class="black--text align-center mb-0">{{ getRoundNumber(block.getTotalReward().toEth()) }}</p>
          </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          Uncles Info
        =====================================================================================
        -->
        <v-flex sm12 v-if="hasUncles(block)" pt-3>
          <v-layout row class="uncle">
            <v-flex sm2> </v-flex>
            <v-flex sm6>
              <div class="uncles">
                <v-card flat color="transparent">
                  <v-card-title class="pt-1 font-weight-medium pb-2">{{ $tc('uncle.name', 2) }}:</v-card-title>
                  <v-layout row pl-4 pr-4 pb-2 v-for="(uncle, index) in block.getUncles()" :key="index">
                    <p class="info--text psmall pr-2">{{ $t('common.hash') }}:</p>
                    <app-transform-hash :hash="uncle.getHash()" :link="`/uncle/${uncle.getHash()}`" />
                  </v-layout>
                </v-card>
              </div>
            </v-flex>
            <v-spacer />
          </v-layout>
        </v-flex>
        <v-divider class="mb-2 mt-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppTransformHash  from '@app/core/components/ui/AppTransformHash.vue'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { Block, SimpleBlock, Tx, SimpleTx } from '@app/core/models'

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
  @Prop(Object) block!: Block | SimpleBlock

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  hasUncles(block) {
    return block.getUncles().length > 0
  }

  successfulTxs(): number {
    const txs: any[] = this.block.getTxs()
    return txs.filter((t: Tx | SimpleTx) => t.getStatus() === true).length
  }

  failedTxs(): number {
    const failed = this.block.getTxs().length - this.successfulTxs()
    return failed < 0 ? 0 : failed
  }
  sucessTransalate(): number {
    return this.successfulTxs() > 1 ? 2 : 1
  }

  failedTranslate(): number {
    return this.failedTxs() > 1 ? 2 : 1
  }
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
.arrow {
    position: relative;
}

.line {
    border-left: 1px solid #b4bfd2;
    border-bottom: 1px solid #b4bfd2;
    height: 50px;
    width: 105%;
    position: absolute;
    margin-left: 2px;
    margin-bottom: 10px;
}

.uncles {
  border: 1px solid #b4bfd2;
  padding-bottom: 5px;
}
</style>
