<template>
    <v-dialog v-model="showDialog" :hide-overlay="true" justify-end width="300" origin="right" class="app-state-diff">
        <v-btn slot="activator" :small="true" class="more-btn" color="white" fab depressed>
            <p class="info--text subheading pb-2">...</p>
        </v-btn>
        <v-card class="overflow-hidden">
            <v-card-text class="py-0 pr-0">
                <v-flex>
                    <v-layout row align-center justify-space-between>
                        <div :class="[titleColor, 'font-weight-bold']">{{ state.title ? state.title : status }}</div>
                        <v-btn :small="true" icon @click="showDialog = false">
                            <v-icon class="fas fa-times info--text close-icon" />
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-card-text>
            <v-card-text class="pt-2 caption">
                <v-flex>
                    <v-layout v-for="(data, i) in state.data" :key="i" row align-center justify-space-between>
                        <p>{{ data.name }}</p>
                        <p v-if="data.value" class="text-uppercase">
                            <span v-if="showMinus(data.name)">{{ showMinus(data.name) }}</span>
                            {{ data.value.value }} {{ data.value.unit }}
                        </p>
                    </v-layout>
                    <hr class="my-2 divider" />
                    <v-layout v-if="state.balAfter" row align-center justify-space-between>
                        <p>{{ $t('state.bal-after') }}</p>
                        <p class="text-uppercase">{{ state.balAfter.value }} {{ state.balAfter.unit }}</p>
                    </v-layout>
                </v-flex>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { State } from '@app/core/components/props'

const minusTypes = ['Tx Fee', 'Value Sent']
const plusTypes = ['Total Block Reward', 'Tx Fees Rewards', 'Uncle Reward', 'Including Uncle Reward?']

@Component
export default class AppStateDiff extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) state!: State

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    showDialog = false

    /*
  ===================================================================================
   Watch
  ===================================================================================
  */
    @Watch('showState')
    onShowState(newVal: boolean): void {
        this.showDialog = newVal
    }

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */

    get titleColor(): string {
        switch (this.state.status as any) {
            case true:
                return 'txSuccess--text'
            case false:
                return 'txFail--text'
            default:
                return 'info--text'
        }
    }

    get status(): string | undefined {
        switch (this.state.status as any) {
            case true:
                return `${this.$t('tx.type.success')}`
            default:
                return `${this.$t('tx.type.fail')}`
        }
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Returns + or - symbol based on name
     * @param name {String}
     * @returns {String}
     */
    showMinus(name: string): string | undefined {
        if (minusTypes.indexOf(name) > -1) {
            return '-'
        }
        if (plusTypes.indexOf(name) > -1) {
            return '+'
        }
    }
}
</script>

<style lang="scss" scoped>
.close-icon {
    font-size: 14px;
}
.app-state-diff {
    .more-btn {
        height: 25px;
        width: 25px;
    }

    .v-dialog__content {
        justify-content: flex-end;

        .v-card {
            border-radius: 2px;
            border: solid 1px #b4bfd2;

            .divider {
                background-color: #000;
                border: 0;
                height: 1px;
            }
        }
    }
}
</style>
