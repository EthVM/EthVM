<template>
    <div>
        <v-layout align-start justify-start row class="pa-2 mr-2 ml-2">
            <!--
      =====================================================================================
        DETAIL TITLE
      =====================================================================================
      -->
            <v-flex xs4 sm3 md2>
                <div class="info--text font-weight-medium">{{ detail.title }}</div>
            </v-flex>
            <!--
      =====================================================================================
        DETAIL INFO
      =====================================================================================
      -->
            <v-flex v-if="!detail.txInput" xs7 sm8 md9 pr-0>
                <div v-if="isLoading">
                    <v-flex xs12 class="table-row-loading"></v-flex>
                </div>
                <div v-else>
                    <div v-if="!isMono">
                        <router-link v-if="detail.link" :to="detail.link">
                            <div class="text-truncate secondary--text">{{ detail.detail }}</div>
                        </router-link>
                        <div v-else class="text-muted text-truncate detail-container">
                            <span class="pr-1">{{ detail.detail }}</span>
                            <app-tooltip v-if="detail.tooltip" :text="detail.tooltip" />
                            <v-layout
                                v-if="detail.priceChange"
                                :class="[detail.tooltip ? 'pl-3' : 'pl-2', priceChangeClass, 'price-container', 'font-weight-medium']"
                                row
                                wrap
                                align-center
                                justify-start
                            >
                                (<span class="pl-1">{{ detail.priceChange }}%</span>
                                <v-img v-if="priceChangeSymbol === '+'" :src="require('@/assets/up.png')" height="16px" max-width="16px" contain></v-img>
                                <v-img v-if="priceChangeSymbol === '-'" :src="require('@/assets/down.png')" height="16px" max-width="16px" contain></v-img>
                                )
                            </v-layout>
                        </div>
                    </div>
                    <div v-else>
                        <app-transform-hash v-if="detail.link" :hash="detail.detail" :link="detail.link" />
                        <app-transform-hash v-else :hash="detail.detail" :is-blue="false" />
                    </div>
                </div>
            </v-flex>
            <v-flex v-if="!detail.txInput" xs1 pt-0 pb-0 pl-1>
                <app-copy-to-clip v-if="detail.copy" :value-to-copy="detail.detail" />
            </v-flex>
            <v-flex v-if="detail.txInput" hidden-xs-only sm9 md10>
                <div class="data-input pa-3">
                    <p v-for="(item, index) in detail.txInput" :key="index" class="mb-2">{{ item }}</p>
                </div>
            </v-flex>
        </v-layout>
        <v-layout v-if="detail.txInput" align-start justify-start row class="mr-2 ml-2">
            <v-flex xs12 hidden-sm-and-up pt-0>
                <div class="data-input pa-3">
                    <p v-for="(item, index) in detail.txInput" :key="index" class="mb-2">{{ item }}</p>
                </div>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Detail } from '@app/core/components/props'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import BN from 'bignumber.js'

@Component({
    components: {
        AppTooltip,
        AppCopyToClip,
        AppTransformHash
    }
})
export default class AppDetailsListRow extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) detail!: Detail
    @Prop(Boolean) isLoading!: boolean

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get priceChangeSymbol() {
        if (this.detail.priceChange && new BN(this.detail.priceChange).gt(0)) {
            return '+'
        }
        if (this.detail.priceChange && new BN(this.detail.priceChange).lt(0)) {
            return '-'
        }
        return ''
    }

    get priceChangeClass(): string {
        if (this.detail.priceChange && new BN(this.detail.priceChange).gt(0)) {
            return 'txSuccess--text'
        }
        if (this.detail.priceChange && new BN(this.detail.priceChange).lt(0)) {
            return 'txFail--text'
        }
        return 'black--text'
    }

    get isMono(): boolean {
        return !!this.detail.mono
    }
}
</script>

<style scoped lang="css">
.data-input {
    border: 1.2px solid #dee5f0;
    border-radius: 5px;
}
.detail-container {
    display: flex;
}
.price-container {
    margin-bottom: 0 !important;
}
</style>
