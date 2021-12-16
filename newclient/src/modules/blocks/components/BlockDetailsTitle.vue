<template>
    <v-flex xs12>
        <v-layout v-if="!loading" row wrap align-center justify-start mt-1 mb-1>
            <!-- Previous Block -->
            <v-flex xs2 sm1>
                <v-layout v-if="prevBlock != ''" align-center justify-start>
                    <v-btn :to="prevBlock" flat color="secondary" class="black--text" icon @click="reload()"> <v-icon>fas fa-angle-left</v-icon> </v-btn>
                </v-layout>
            </v-flex>
            <!-- Title -->
            <v-flex xs8 sm10 pl-0 pr-0>
                <v-layout row wrap align-start justify-start>
                    <v-flex xs12>
                        <v-layout row wrap align-center justify-start>
                            <v-card-title class="title font-weight-bold py-1 pl-1">Block #{{ blockNumber }} </v-card-title>
                            <v-dialog v-if="hasUncles" v-model="dialog" max-width="700">
                                <template #activator="{ on }">
                                    <v-btn slot="activator" round outline color="primary" class="text-capitalize mx-0" small v-on="on">
                                        {{ $tc('uncle.name', unclesPlural) }}
                                        <v-icon right small>fa fa-angle-right</v-icon>
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="title font-weight-bold">{{ $tc('uncle.name', unclesPlural) }}:</v-card-title>
                                    <v-divider class="lineGrey" />
                                    <v-list>
                                        <v-list-tile v-for="(uncle, index) in uncles" :key="index">
                                            <v-layout row justify-start align-center fill-height>
                                                <v-card-title class="info--text p-0">{{ $t('common.hash') }}:</v-card-title>
                                                <app-transform-hash :hash="uncle | toChecksum" :link="`/uncle/${uncle}`" />
                                            </v-layout>
                                        </v-list-tile>
                                    </v-list>
                                </v-card>
                            </v-dialog>
                        </v-layout>
                    </v-flex>
                    <v-flex v-if="hasEthBlock" shrink class="border-conatiner hidden-xs-only">
                        <v-img :src="ethBlockImg" :lazy-src="require('@/assets/loading-eth-block.svg')" contain min-height="150px" min-width="150px"></v-img>
                    </v-flex>
                    <v-flex v-if="hasEthBlock" xs12 sm7 md6 class="hidden-xs-only">
                        <v-card-text v-if="ethBlockDesc !== ''" class="py-1">
                            {{ ethBlockDesc }}
                        </v-card-text>
                        <v-progress-linear v-else color="lineGrey" value="40" indeterminate height="100" class="my-1 mx-3" />

                        <v-btn
                            depressed
                            color="secondary"
                            class="text-none mx-3"
                            :href="`https://www.myetherwallet.com/wallet/dapps/eth-blocks/block/${currBlock}`"
                            target="_blank"
                            @click="trackMint"
                        >
                            Mint this block as NFT
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!-- Next Block -->
            <v-flex v-if="nextBlock != ''" xs2 sm1>
                <v-layout align-center justify-end>
                    <v-btn :to="nextBlock" flat color="secondary" class="black--text" icon> <v-icon>fas fa-angle-right</v-icon> </v-btn>
                </v-layout>
            </v-flex>
            <v-flex v-if="hasEthBlock" xs12 align-center justify-start hidden-sm-and-up px-3>
                <div v-if="ethBlockDesc === ''">
                    <v-layout px-2 mb-2>
                        <div class="border-conatiner desc-loading">
                            <v-img :src="ethBlockImg" :lazy-src="require('@/assets/loading-eth-block.svg')" contain height="110px" width="110px"></v-img>
                        </div>
                        <v-progress-linear color="lineGrey" value="40" indeterminate height="80" class="float-loading" />
                    </v-layout>
                </div>
                <div v-else>
                    <div class="border-conatiner float-img">
                        <v-img :src="ethBlockImg" contain height="110px" width="110px"></v-img>
                    </div>
                    <v-flex shrink>
                        <p>
                            {{ ethBlockDesc }}
                        </p>
                    </v-flex>
                </div>

                <v-btn
                    depressed
                    color="secondary"
                    class="text-capitalize mx-0"
                    :href="`https://www.myetherwallet.com/wallet/dapps/eth-blocks/block/${currBlock}`"
                    target="_blank"
                    @click="trackMint"
                >
                    Mint this block as NFT
                </v-btn>
            </v-flex>
        </v-layout>
        <div v-else>
            <v-layout align-center justify-space-between>
                <v-flex v-if="!isSubscribed" xs5 sm4>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </v-flex>
                <v-flex v-if="isSubscribed" xs8 sm11>
                    <v-card-title class="title font-weight-bold pl-4">{{ $t('message.not-mined') }}</v-card-title>
                </v-flex>
                <v-flex v-if="isSubscribed" xs2 sm1>
                    <v-progress-circular :size="20" color="secondary" indeterminate></v-progress-circular>
                </v-flex>
            </v-layout>
        </div>
    </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { MatomoMixin } from '@app/core/components/mixins/Matomo/matomo-mixin'
import { Category, Action } from '@app/core/components/mixins/Matomo/matomoEnums'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'

@Component({
    components: {
        AppTransformHash
    }
})
export default class BlockDetailsTitle extends Mixins(NumberFormatMixin, MatomoMixin) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(String) nextBlock!: string
    @Prop(String) prevBlock!: string
    @Prop(Array) uncles!: string[]
    @Prop(Number) currBlock!: number
    @Prop({ type: Boolean, default: false }) hasEthBlock!: boolean
    @Prop({ type: String, default: '' }) ethBlockImg!: string
    @Prop(String) ethBlockDesc!: string
    @Prop({ type: Boolean, default: true }) loading!: boolean
    @Prop({ type: Boolean, default: false }) isSubscribed!: boolean

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    dialog = false

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get title(): string {
        return this.$i18n.t('block.detail').toString()
    }

    get hasUncles(): boolean {
        return !!this.uncles && this.uncles.length > 0
    }

    get unclesPlural(): number {
        return this.hasUncles && this.uncles.length > 1 ? 2 : 1
    }

    get blockNumber(): string {
        return this.formatNumber(this.currBlock)
    }
    /*
  ===================================================================================
  Methods
  ===================================================================================
  */
    /**
     * Emit's reload to parent
     */
    reload() {
        this.$emit('reload')
    }
    trackMint() {
        this.setMatomoEvent(Category.BLOCK_PAGE, Action.CLICK_MINT)
    }
}
</script>
<style lang="scss">
.border-conatiner {
    border: 1px solid #b4bfd2;
    border-radius: 5px;
}
.nft-image-container {
    height: 160px;
    width: 160px;
    padding: 5px;
}
.float-img {
    float: left;
    margin-right: 10px;
    padding: 4px;
}
.desc-loading {
    margin-right: 10px;
    padding: 4px;
}
</style>
