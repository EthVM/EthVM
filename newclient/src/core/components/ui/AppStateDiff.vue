<template>
    <v-dialog :hide-overlay="true" v-model="showDialog" justify-end width="300" origin="right">
        <v-btn slot="activator" class="more-btn" color="white" fab depressed>
            <p class="info--text title pb-2">...</p>
        </v-btn>
        <v-card class="overflow-hidden">
            <v-card-title class="pb-0">
                <v-flex>
                    <v-layout row align-center justify-space-between>
                        <div :class="[titleColor, 'font-weight-bold', 'state-title']">{{ status }}</div>
                    </v-layout>
                </v-flex>
                <v-btn class="close-btn" icon @click="showDialog = false">
                    <v-icon class="fas fa-times info--text" />
                </v-btn>
            </v-card-title>
            <v-card-text class="pt-2">
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

const minusTYPES = ['Tx Fee', 'Value Sent']
const plusTYPES = ['Total Block Reward', 'Tx Fees Rewards', 'Uncle Reward', 'Including Uncle Reward?']

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
    Lifecycle
  ===================================================================================
  */

    mounted() {
        // console.log('mounted', this.state)
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
            case false:
                return `${this.$t('tx.type.fail')}`
            default:
                return ''
        }
    }

    get stateData(): [] {
        const data = []

        return []
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    showMinus(name) {
        if (minusTYPES.indexOf(name) > -1) {
            return '-'
        }
        if (plusTYPES.indexOf(name) > -1) {
            return '+'
        }
    }
}
</script>

<style lang="scss" scoped>
.v-dialog__content {
    justify-content: flex-end;

    .v-card {
        border-radius: 2px;
        border: solid 1px #b4bfd2;

        .close-btn {
            position: absolute;
            right: -12px;
            top: -7px;
            .v-icon {
                font-size: 14px;
            }
        }

        .divider {
            background-color: #000;
            border: 0;
            height: 1px;
        }

        .state-title {
            font-size: 16px;
        }
    }
}
</style>
