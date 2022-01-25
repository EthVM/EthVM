<template>
    <v-layout>
        <!--
        =====================================================================================
          Mobile (SM)
        =====================================================================================
        -->
        <v-flex xs12 hidden-md-and-up>
            <div :class="txStatusClass">
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-3 pb-3 pr-3 pl-3">
                    <!--
                    =====================================================================================
                      ETH VALUE
                      Responsive Tally:
                      XS-SM: 6 (6)
                    =====================================================================================
                    -->
                    <v-flex xs6 pa-1>
                        <p :class="transferValueClass">
                            {{ amountSign }}{{ transferValue.value }}
                            {{ $t(`common.${transferValue.unit}`) }}
                            <app-tooltip v-if="transferValue.tooltipText" :text="`${transferValue.tooltipText} ${$t('common.eth')}`" />
                        </p>
                    </v-flex>
                    <!--
                    =====================================================================================
                      TIMESTAMP / BALANCE BREAKDOWN
                      Responsive Tally:
                      XS-SM: 12 (6)
                    =====================================================================================
                    -->
                    <v-flex xs6>
                        <v-layout row align-center justify-end>
                            <app-time-ago :timestamp="transfer.getTimestamp()" class="info--text caption" />
                            <app-state-diff v-if="!isPending && state" :state="state" class="ml-2 mr-1" />
                            <p v-if="isMinedIndicator && isPending" class="caption primary--text blinking ml-2">{{ $t('tx.mined') }}</p>
                        </v-layout>
                    </v-flex>
                    <!--
                    =====================================================================================
                      TRANSACTION # / HASH
                      Responsive Tally:
                      XS-SM: 24 (12)
                    =====================================================================================
                    -->
                    <v-flex xs12>
                        <v-layout row align-center justift-start pa-1>
                            <p class="info--text tx-string caption">{{ $tc('tx.hash', 1) }}:</p>
                            <app-transform-hash :hash="transfer.getHash()" :link="`/tx/${transfer.getHash()}`" />
                        </v-layout>
                    </v-flex>
                    <!--
                    =====================================================================================
                      TYPE: Incoming / Outgoing / Self Sent
                      Responsive Tally:
                      XS-SM: 29 (5)
                    =====================================================================================
                    -->
                    <v-flex xs5 sm3 pa-1>
                        <v-card :color="typeColor" flat>
                            <p class="white--text text-xs-center caption pa-1">{{ typeString }}</p>
                        </v-card>
                    </v-flex>
                    <!--
                    =====================================================================================
                      TYPE ADDRESS: Incoming / Outgoing / Self Sent addr
                      Responsive Tally:
                      XS-SM: 36 (7)
                    =====================================================================================
                    -->
                    <v-flex xs7 sm9 pa-1>
                        <app-transform-hash v-if="!isContractCreation" :hash="typeAddr | toChecksum" :link="`/address/${typeAddr}`" />
                    </v-flex>
                </v-layout>
            </div>
        </v-flex>
        <!--
        =====================================================================================
          Tablet/ Desktop (SM - XL)
        =====================================================================================
        -->
        <v-flex hidden-sm-and-down sm12>
            <v-layout grid-list-xs row align-center justify-start fill-height>
                <!--
                =====================================================================================
                  TRANSACTION # / HASH
                  Responsive Tally:
                  MD: 5/12 (5)
                  Lg: 5/12 (5)
                =====================================================================================
                -->
                <v-flex md5>
                    <v-layout row wrap align-center pl-3>
                        <v-flex sm12>
                            <v-layout row align-center justift-start pa-2>
                                <p class="info--text tx-string">{{ $tc('tx.hash', 1) }}:</p>
                                <app-transform-hash :hash="transfer.getHash()" :link="`/tx/${transfer.getHash()}`" />
                            </v-layout>
                        </v-flex>
                        <v-flex sm12 pt-0 pb-0>
                            <v-layout row align-center justify-start fill-height>
                                <v-flex sm5 lg4>
                                    <v-card :color="typeColor" flat>
                                        <p class="white--text text-sm-center caption pa-1">{{ typeString }}</p>
                                    </v-card>
                                </v-flex>
                                <v-flex sm7 lg8 pl-0>
                                    <app-transform-hash
                                        v-if="!isContractCreation"
                                        :hash="typeAddr | toChecksum"
                                        :link="`/address/${typeAddr}`"
                                        :italic="true"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <!--
                =====================================================================================
                  ETH VALUE
                  Responsive Tally:
                  MD: 8/12 (3)
                  LG: 7/2 (2)
                =====================================================================================
                -->
                <v-flex md3 lg2>
                    <v-layout row wrap align-center pl-1 pr->
                        <v-flex sm12>
                            <p :class="transferValueClass">
                                <span class="hidden-lg-and-up info--text pr-1">{{ $t('common.amount') }}:</span>
                                {{ amountSign }}{{ transferValue.value }}
                                {{ $t(`common.${transferValue.unit}`) }}
                                <app-tooltip v-if="transferValue.tooltipText" :text="`${transferValue.tooltipText} ${$t('common.eth')}`" />
                            </p>
                        </v-flex>
                        <v-flex sm12 hidden-lg-and-up>
                            <p :class="[type === 'out' ? 'black--text' : 'info--text', 'text-truncate mb-0']">
                                <span class="info--text pr-1">{{ feeString }}: </span><span v-if="!transfer.getIsPending() && type === 'out'">-</span
                                >{{ transferFee.value }}
                            </p>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <!--
                =====================================================================================
                  Tx Fee
                  Responsive Tally:
                  MD: 9/12 (0)
                  LG: 9/2 (2)
                =====================================================================================
                -->
                <v-flex hidden-md-and-down lg2>
                    <p :class="[type === 'out' ? 'black--text' : 'info--text', 'text-truncate mb-0']">
                        <span v-if="hasFeeSign">-</span>{{ transferFee.value }}
                    </p>
                </v-flex>
                <!--
                =====================================================================================
                  Age
                  Responsive Tally:
                  MD: 11/12 (2)
                  LG: 11/2 (2)
                =====================================================================================
                -->
                <v-flex md3 lg2>
                    <app-time-ago :timestamp="transfer.getTimestamp()" />
                </v-flex>
                <!--
                =====================================================================================
                  More
                  Responsive Tally:
                  MD: 12/12 (1)
                  LG: 12/12 (1)
                =====================================================================================
                -->
                <v-flex v-if="!isPending && transfer.getStatus() !== null" shrink>
                    <v-layout row align-center justify-end>
                        <v-icon v-if="transfer.getStatus()" small class="txSuccess--text">fa fa-check-circle</v-icon>
                        <v-icon v-else small class="txFail--text">fa fa-times-circle</v-icon>
                        <app-state-diff v-if="state" :state="state" class="ml-3 mr-1" />
                    </v-layout>
                </v-flex>
                <v-flex v-else shrink>
                    <p v-if="isMinedIndicator" class="caption primary--text blinking">{{ $t('tx.mined') }}</p>
                </v-flex>
            </v-layout>
            <v-divider class="mb-2 mt-2" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import AppStateDiff from '@app/core/components/ui/AppStateDiff.vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'
import { EthTransfer } from '@app/modules/address/models/EthTransfer'
import BN from 'bignumber.js'

const TYPES = ['in', 'out', 'self', 'contractCreation']
@Component({
    components: {
        AppTooltip,
        AppTimeAgo,
        AppTransformHash,
        AppStateDiff
    }
})
export default class TableTxsRow extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Object) transfer!: EthTransfer
    @Prop(String) address!: string
    @Prop({ type: Boolean, default: false }) isPending!: boolean
    @Prop(Boolean) isMinedIndicator?: boolean
    @Prop(Function) getStateDiff!: (_hash: string, _type: string) => void
    @Prop(Boolean) loadingStateDiff!: boolean
    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */
    created() {
        if (this.transfer.getStatus() === false && !this.transfer.stateDiff && this.transfer.getFee().value !== '0') {
            this.getStateDiff(this.transfer.getHash(), this.type)
        }
    }
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get state(): object {
        if (!this.loadingStateDiff) {
            const stateData = [{ name: `${this.$t('state.bal-before')}`, value: this.transfer.getBalBefore(this.type) }]
            if (this.type !== TYPES[0]) {
                stateData.push({ name: `${this.$tc('tx.fee', 1)}`, value: this.transfer.getFee() })
            }
            stateData.push({
                name: this.getValueTitle,
                value: this.transfer.getStatus() === false ? NumberFormatHelper.formatNonVariableEthValue(new BN(0)) : this.transfer.getValue()
            })
            return {
                status: this.transfer.getStatus(),
                balAfter: this.transfer.getBalAfter(this.type),
                data: stateData
            }
        }
        return {}
    }

    get getValueTitle(): string {
        if (this.type === TYPES[1] || this.type === TYPES[3]) {
            if (this.transfer.getStatus() === false) {
                return `${this.$t('state.actual-sent')}`
            }
            return `${this.$t('state.val-sent')}`
        }
        if (this.type === TYPES[0]) {
            if (this.transfer.getStatus() === false) {
                return `${this.$t('state.actual-received')}`
            }
            return `${this.$t('state.val-received')}`
        }
        return `${this.$t('state.actual-sent-received')}`
    }

    get txStatusClass(): string {
        if (this.transfer && this.transfer.getStatus() !== null) {
            return this.transfer.getStatus() ? 'tx-status-sucess table-row-mobile' : 'tx-status-fail table-row-mobile'
        }
        return 'table-row-mobile'
    }
    get isSmall(): boolean {
        return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
    }
    get type(): string {
        const from = this.transfer.getFrom().toLowerCase()
        const to = this.transfer.getTo().toLowerCase()
        if (to === '') {
            return TYPES[3]
        }
        const addr = this.address.toLowerCase()
        if (addr === from && addr === to) {
            return TYPES[2]
        } else if (addr === from) {
            return TYPES[1]
        }
        return TYPES[0]
    }
    get typeString(): string {
        switch (this.type) {
            case TYPES[0]:
                return `${this.$t('tx.type.in')}`
            case TYPES[1]:
                return `${this.$t('tx.type.out')}`
            case TYPES[3]:
                return `${this.$t('contract.creation')}`
            default:
                return `${this.$t('tx.type.self')}`
        }
    }
    get typeColor(): string {
        switch (this.type) {
            case TYPES[0]:
                return 'primary'
            case TYPES[1]:
                return 'error'
            case TYPES[3]:
                return 'warning'
            default:
                return 'info'
        }
    }
    get typeAddr(): string {
        switch (this.type) {
            case TYPES[0]:
                return this.transfer.getFrom()
            case TYPES[1]:
                return this.transfer.getTo()
            default:
                return this.address
        }
    }
    get amountSign(): string {
        if (this.transfer.getStatus() !== null) {
            if (this.type === TYPES[0]) {
                return '+'
            }
            if (this.type === TYPES[1]) {
                return '-'
            }
        }
        return ''
    }
    get transferValue(): FormattedNumber {
        return this.transfer.getValue()
    }
    get transferValueClass(): string {
        let textColor = 'black--text'
        if (this.transfer.getStatus() === null) {
            textColor = 'info--text'
        }
        return this.isSmall ? `${textColor} caption` : textColor
    }
    get transferFee(): FormattedNumber {
        return this.transfer.getFee()
    }
    get feeString(): string {
        return this.isPending ? `${this.$t('tx.estimated-fee')}` : `${this.$tc('tx.fee', 1)}`
    }
    get hasFeeSign(): boolean {
        return this.transfer.getStatus() !== null && this.type === TYPES[1]
    }
    get isMined(): boolean {
        return !this.transfer.getIsPending()
    }

    get isContractCreation(): boolean {
        return this.type === TYPES[3]
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
.tx-status-fail {
    border-left: 2px solid #fe1377;
}
.tx-status-sucess {
    border-left: 2px solid #40ce9c;
}
.tx-string {
    min-width: 3em;
}
.more-btn {
    height: 20px;
    width: 20px;
}
.blinking {
    animation: blinker 2s linear infinite;
}
@keyframes blinker {
    50% {
        opacity: 0;
    }
}
</style>
