<template>
    <app-state-diff :state="state" />
</template>

<script lang="ts">
import AppStateDiff from '@app/core/components/ui/AppStateDiff.vue'
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator'
import { State } from '@app/core/components/props'
import { getBlockUncleRewards } from './rewards.graphql'
// import { getBlockUncleRewards_getBlockByHash_summary as BlockUncleRewards } from './apolloTypes/getBlockUncleRewards'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import BN from 'bignumber.js'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { throwError } from 'rxjs'

@Component({
    components: {
        AppStateDiff
    }
})
export default class BlockUncleRewards extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Object) state!: State

    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

    mounted() {
        if (this.state.blockNumber) {
            this.getBlockUncleRewards()
        }
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */
    /**
     * Fetches Block Uncle rewards
     */
    getBlockUncleRewards(): void {
        this.$apollo
            .query({
                query: getBlockUncleRewards,
                variables: {
                    blockRef: this.state.blockNumber
                }
            })
            .then(response => {
                const uncleRewards = response.data.getBlockByNumber.summary.rewards.uncles
                if (uncleRewards !== '0x0') {
                    this.state.data.push({
                        name: `${this.$t('state.including-uncle')}`,
                        value: this.formatVariableUnitEthValue(new BN(uncleRewards))
                    })
                }
            })
            .catch(error => {
                throw error
            })
    }
}
</script>
