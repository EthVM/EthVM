<template>
    <v-card color="white" flat>
        <!--
        =====================================================================================
        ADDRESS HASH, QR CODE, COPY BUTTON, IDENTICON, CHIPS
        =====================================================================================
        -->
        <v-layout :class="layoutPadding" grid-list-md align-start justify-start row fill-height>
            <!--
            =====================================================================================
              BLOCKIE
            =====================================================================================
            -->
            <v-flex shrink>
                <v-layout align-start justify-center row fill-height pa-2>
                    <blockies :address="address.address" />
                </v-layout>
            </v-flex>
            <v-flex d-block>
                <v-layout wrap column fill-height pa-1>
                    <v-flex xs12>
                        <v-layout row wrap align-center justify-space-between>
                            <v-card-title class="title font-weight-bold pl-1 pr-3 pb-2">{{ title }}</v-card-title>
                            <!--
                            =====================================================================================
                              CHIPS
                            =====================================================================================
                            -->
                            <v-layout hidden-sm-and-down align-center justify-start row fill-height pt-2>
                                <div v-if="!address.isContract && address.isMiner" class="chip miner-chip mr-2 ml-1">{{ $t('miner.name') }}</div>
                                <div v-if="!address.isContract && address.isContractCreator" class="chip creator-chip">{{ $t('contract.creator') }}</div>
                                <div v-if="address.isContract" class="chip contract-chip">{{ $tc('contract.name', 1) }}</div>
                            </v-layout>
                            <!--
                            =====================================================================================
                              FAVORITE/ QR
                            =====================================================================================
                            -->
                            <v-layout row align-center justify-end>
                                <fav-handler-like :address="address.hash" />
                                <address-qr :address="address.hash" :large="true" />
                            </v-layout>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row align-center justify-start>
                            <app-copy-to-clip :value-to-copy="address.hash" />
                            <p class="break-hash font-mono pt-0 pr-4 pl-1">{{ address.hash }}</p>
                        </v-layout>
                    </v-flex>
                    <v-flex v-if="hasChips" xs12 hidden-md-and-up>
                        <v-layout align-center justify-start row fill-height pt-2>
                            <div v-if="!address.isContract && address.isMiner" class="chip miner-chip mr-2 ml-1">{{ $t('miner.name') }}</div>
                            <div v-if="!address.isContract && address.isContractCreator" class="chip creator-chip">{{ $t('contract.creator') }}</div>
                            <div v-if="address.isContract" class="chip contract-chip">{{ $tc('contract.name', 1) }}</div>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!-- <v-flex hidden-xs-only fill-height mr-3>
        <v-layout justify-end> <address-qr :address="address.hash" :large="true" /> </v-layout>
      </v-flex> -->
        </v-layout>

        <!--
        =====================================================================================
          BLOCKS
        =====================================================================================
        -->
        <v-layout>
            <!--
            =====================================================================================
              DESKTOP LAYOUT
            =====================================================================================
            -->
            <v-flex hidden-sm-and-down>
                <v-layout :class="layoutPadding" row wrap justify-space-between>
                    <!--
                    =====================================================================================
                      ETHER BALANCE
                    =====================================================================================
                    -->
                    <v-flex xs12 md4>
                        <v-card class="primary white--text pl-2 pr-2" flat>
                            <v-card-text class="pb-0">{{ $t('common.eth-balance') }}</v-card-text>
                            <v-card-title v-if="!loading" class="title font-weight-regular text-truncate pr-1"
                                >{{ balance.value }} {{ $t(`common.${balance.unit}`) }}
                                <v-tooltip v-if="balance.tooltipText" bottom>
                                    <template #activator="data">
                                        <v-icon class="white--text text-xs-center pl-1" small v-on="data.on">fa fa-question-circle</v-icon>
                                    </template>
                                    <span>{{ balance.tooltipText }} {{ $t('common.eth') }}</span>
                                </v-tooltip>
                            </v-card-title>
                            <v-card-title v-else>
                                <v-progress-linear
                                    color="primaryLight"
                                    background-color="white"
                                    background-opacity="0.3"
                                    value="40"
                                    indeterminate
                                    height="21"
                                    class="ma-0"
                                />
                            </v-card-title>
                        </v-card>
                    </v-flex>
                    <!--
                    =====================================================================================
                      USD BALANCE
                    =====================================================================================
                    -->
                    <v-flex xs12 md4>
                        <v-card class="error white--text pl-2 pr-2" flat>
                            <v-card-text class="pb-0">{{ $t('usd.value') }} {{ usdBalanceString }}</v-card-text>
                            <v-card-title v-if="!loadingUSD" class="title font-weight-regular text-truncate">
                                {{ balanceUsd.value }}
                                <v-tooltip v-if="balanceUsd.tooltipText" bottom>
                                    <template #activator="data">
                                        <v-icon small class="white--text text-xs-center pl-1" v-on="data.on">fa fa-question-circle</v-icon>
                                    </template>
                                    <span>{{ balanceUsd.tooltipText }}</span>
                                </v-tooltip>
                            </v-card-title>
                            <v-card-title v-else>
                                <v-progress-linear
                                    color="errorLight"
                                    background-color="white"
                                    background-opacity="0.3"
                                    value="40"
                                    indeterminate
                                    height="21"
                                    class="ma-0"
                                />
                            </v-card-title>
                        </v-card>
                    </v-flex>
                    <!--
                    =====================================================================================
                      TOTAL TOKENS OWNED
                    =====================================================================================
                    -->
                    <v-flex xs12 md4>
                        <v-card class="warning white--text pl-2 pr-2" flat>
                            <v-card-text class="pb-0">{{ $t('token.number') }}</v-card-text>
                            <v-card-title v-if="!loadingTokens" class="title font-weight-regular text-truncate">{{ address.totalERC20 }}</v-card-title>
                            <v-card-title v-else>
                                <v-progress-linear
                                    color="warningLight"
                                    background-color="white"
                                    background-opacity="0.3"
                                    value="40"
                                    indeterminate
                                    height="21"
                                    class="ma-0"
                                />
                            </v-card-title>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!--
            =====================================================================================
              MOBILE LAYOUT
            =====================================================================================
            -->
            <v-flex hidden-md-and-up pt-0>
                <div class="xs-overflow">
                    <!--
                    =====================================================================================
                      ETHER BALANCE
                    =====================================================================================
                    -->
                    <v-card class="primary xs-div white--text">
                        <v-card-text class="pb-0">{{ $t('common.eth-balance') }}</v-card-text>
                        <v-card-title v-if="!loading" class="title font-weight-regular text-truncate pr-1"
                            >{{ balance.value }} {{ $t(`common.${balance.unit}`) }}
                            <v-tooltip v-if="balance.tooltipText" bottom>
                                <template #activator="data">
                                    <v-icon small class="white--text text-xs-center pl-1" v-on="data.on">fa fa-question-circle</v-icon>
                                </template>
                                <span>{{ balance.tooltipText }} {{ $t('common.eth') }}</span>
                            </v-tooltip>
                        </v-card-title>
                        <v-card-title v-else>
                            <v-progress-linear
                                color="primaryLight"
                                background-color="white"
                                background-opacity="0.3"
                                value="40"
                                indeterminate
                                height="25"
                                class="ma-2"
                            />
                        </v-card-title>
                    </v-card>
                    <!--
                    =====================================================================================
                      USD BALANCE
                    =====================================================================================
                    -->
                    <v-card class="error white--text xs-div" flat>
                        <v-card-text class="pb-0">{{ $t('usd.value') }} {{ usdBalanceString }}</v-card-text>
                        <v-card-title v-if="!loadingUSD" class="title font-weight-regular text-truncate">
                            {{ balanceUsd.value }}
                            <v-tooltip v-if="balanceUsd.tooltipText" bottom>
                                <template #activator="data">
                                    <v-icon small class="white--text text-xs-center pl-1" v-on="data.on">fa fa-question-circle</v-icon>
                                </template>
                                <span>{{ balanceUsd.tooltipText }}</span>
                            </v-tooltip>
                        </v-card-title>
                        <v-card-title v-else>
                            <v-progress-linear
                                color="errorLight"
                                background-color="white"
                                background-opacity="0.3"
                                value="40"
                                indeterminate
                                height="25"
                                class="ma-2"
                            />
                        </v-card-title>
                    </v-card>
                    <!--
                    =====================================================================================
                      TOTAL TOKENS OWNED
                    =====================================================================================
                    -->
                    <v-card class="warning white--text xs-div" flat>
                        <v-card-text class="pb-0">{{ $t('token.number') }}</v-card-text>
                        <v-card-title v-if="!loadingTokens" class="title font-weight-regular text-truncate">{{ address.totalERC20 }}</v-card-title>
                        <v-card-title v-else>
                            <v-progress-linear
                                color="warningLight"
                                background-color="white"
                                background-opacity="0.3"
                                value="40"
                                indeterminate
                                height="25"
                                class="ma-2"
                            />
                        </v-card-title>
                    </v-card>

                    <div class="empty-xs"></div>
                </div>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AddressQr from '@app/modules/address/components/AddressQr.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import FavHandlerLike from '@app/modules/favorites/handlers/FavHandlerLike.vue'
import Blockies from '@app/modules/address/components/Blockies.vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import BN from 'bignumber.js'
import { eth } from '@app/core/helper'
import { Address } from './props'

@Component({
    components: {
        AddressQr,
        AppCopyToClip,
        Blockies,
        FavHandlerLike
    }
})
export default class AddressDetail extends Mixins(NumberFormatMixin) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) address!: Address
    @Prop(Boolean) loading!: boolean
    @Prop(Boolean) loadingTokens!: boolean
    @Prop(Number) etherPrice!: number

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get title(): string {
        return this.$i18n.tc('address.name', 1)
    }

    get hasChips(): boolean {
        return this.address.isContract || this.address.isMiner || this.address.isContractCreator
    }

    get layoutPadding(): string {
        const brkPoint = this.$vuetify.breakpoint.name

        switch (brkPoint) {
            case 'xs' || 'sm':
                return 'pa-2'
            default:
                return 'pl-3 pr-3 pt-0 pb-2'
        }
    }

    get balance(): FormattedNumber {
        return this.formatVariableUnitEthValue(new BN(this.address.balance))
    }
    get balanceUsd(): FormattedNumber {
        if (!this.loadingUSD) {
            const balanceEth = eth.toEthFromWei(this.address.balance)
            const balanceUsd = new BN(balanceEth).multipliedBy(new BN(this.etherPrice))
            return this.formatUsdValue(balanceUsd)
        }
        return this.formatUsdValue(new BN(0))
    }

    get exchangeRateFormatted(): string {
        if (!this.loadingUSD) {
            return this.formatUsdValue(new BN(this.etherPrice)).value
        }
        return '0'
    }

    get usdBalanceString(): string {
        return this.loadingUSD ? '' : `(1 ${this.$t('common.eth')} = ${this.exchangeRateFormatted})`
    }

    get loadingUSD(): boolean {
        return this.etherPrice === undefined
    }
}
</script>

<style scoped lang="css">
.break-hash {
    word-break: break-all;
}

.chip {
    height: 28px;
    border-radius: 14px;
    font-size: 85%;
    color: white;
    padding: 5px 10px;
}

.miner-chip {
    background-color: #40ce9c;
}

.creator-chip {
    background-color: #b3d4fc;
}

.contract-chip {
    background-color: #fed18e;
}

p {
    margin-bottom: 0px;
}

.xs-overflow {
    display: flex;
    overflow-x: scroll;
    margin: 8px;
}

.xs-div {
    min-width: 75vw;
    margin-right: 10px;
}

.empty-xs {
    min-width: 10vw;
}
.xs-overflow:after {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 12vw;
    content: '';
    background: linear-gradient(to left, rgba(255, 255, 255, 1) 5%, hsla(0, 0%, 100%, 0) 80%);
}
</style>
