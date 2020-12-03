<template>
    <v-card color="white" flat>
        <!--
        =====================================================================================
          DESKTOP: ADDRESS HASH, QR CODE, COPY BUTTON, IDENTICON, CHIPS
        =====================================================================================
        -->
        <v-layout :class="layoutPadding" grid-list-sm align-center justify-start row fill-height hidden-xs-only>
            <!--
            =====================================================================================
              BLOCKIE
            =====================================================================================
            -->
            <v-flex shrink>
                <v-layout align-start justify-center row fill-height pr-2 pl-2 pt-2>
                    <blockies :address="address.hash" />
                </v-layout>
            </v-flex>
            <!--
            =====================================================================================
              ADDRESS NAME / CHIPS
            =====================================================================================
            -->
            <v-flex d-block>
                <v-layout wrap pa-1>
                    <v-flex xs12>
                        <v-layout row wrap align-center justify-start pr-2 pl-2 pb-2 pt-3>
                            <!--
                            =====================================================================================
                              TITLE
                            =====================================================================================
                            -->
                            <v-card-title class="title font-weight-bold pl-0 pr-3 pb-0 pt-0 break-hash">{{ title }}</v-card-title>
                            <!--
                            =====================================================================================
                              CHIPS
                            =====================================================================================
                            -->
                            <app-adr-chip v-for="(chip, index) in addrChips" :key="index" :chip="chip" class="mr-2" />
                        </v-layout>
                    </v-flex>
                    <!--
                    =====================================================================================
                      COPY/ADDRESS HASH
                    =====================================================================================
                    -->
                    <v-flex xs12>
                        <v-layout row wrap align-center justify-start>
                            <p class="break-hash font-mono pl-2 pr-2">{{ address.hash | toChecksum }}</p>
                            <app-copy-to-clip :value-to-copy="address.hash | toChecksum" />
                            <fav-handler-edit
                                :address="address.hash"
                                :addr-chips="addrChips"
                                class="pr-2 pl-1"
                                @nameChange="updateTitle"
                                @errorFavorites="emitErrorState"
                            />
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!--
            =====================================================================================
              FAVORITE/ QR
            =====================================================================================
            -->
            <v-flex shrink>
                <v-layout row align-center justify-end pa-2>
                    <fav-handler-heart-actions :address="address.hash" :addr-chips="addrChips" @addressHasName="updateTitle" @errorFavorites="emitErrorState" />
                    <address-qr :address="address.hash" />
                </v-layout>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          END DESKTOP
        =====================================================================================
        -->
        <!--
        =====================================================================================
          MOBILE: ADDRESS HASH, QR CODE, COPY BUTTON, IDENTICON, CHIPS
        =====================================================================================
        -->
        <v-layout grid-list-sm align-center justify-start row fill-height hidden-sm-and-up pr-2 pl-2 pt-2>
            <!--
            =====================================================================================
              BLOCKIE
            =====================================================================================
            -->
            <v-flex>
                <v-layout align-start justify-center row fill-height pa-2>
                    <blockies :address="address.hash" width="40px" height="40px" />
                </v-layout>
            </v-flex>
            <!--
            =====================================================================================
              ADDRESS NAME / HASH / COPY / EDIT
            =====================================================================================
            -->
            <v-flex d-block>
                <v-layout row wrap align-center justify-start>
                    <v-flex xs12>
                        <v-layout row align-center justify-start pr-3>
                            <fav-handler-edit
                                :address="address.hash"
                                :addr-chips="addrChips"
                                class="pr-1"
                                @nameChange="updateTitle"
                                @errorFavorites="emitErrorState"
                            />
                            <v-card-title class="body-2 font-weight-bold pa-0 break-hash">{{ title }}</v-card-title>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row align-center justify-start pr-3>
                            <app-copy-to-clip :value-to-copy="address.hash" />
                            <p class="break-hash font-mono pl-1">{{ address.hash }}</p>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>

        <v-layout grid-list-xs align-center justify-start row fill-height hidden-sm-and-up>
            <!--
            =====================================================================================
              CHIPS / LIKE / QR
            =====================================================================================
            -->
            <v-layout row wrap align-center justify-start pl-3 ma-0>
                <app-adr-chip v-for="(chip, index) in addrChips" :key="index" :chip="chip" class="ma-1" />
            </v-layout>
            <v-layout row align-center justify-end pr-2 ma-0>
                <fav-handler-heart-actions :address="address.hash" :addr-chips="addrChips" @addressHasName="updateTitle" @errorFavorites="emitErrorState" />
                <address-qr :address="address.hash" />
            </v-layout>
        </v-layout>
        <!--
        =====================================================================================
          END MOBILE
        =====================================================================================
        -->

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
                        <v-card class="primary white--text pl-2 pr-2 desktop-block" flat>
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
                        <v-card class="error white--text pl-2 pr-2 desktop-block" flat>
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
                        <v-card class="warning white--text pl-2 pr-2 desktop-block" flat>
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
                <div class="blocks-container">
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
                                    class="ma-0"
                                    color="primaryLight"
                                    background-color="white"
                                    background-opacity="0.3"
                                    value="40"
                                    indeterminate
                                    height="25"
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
                                    class="ma-0"
                                    color="errorLight"
                                    background-color="white"
                                    background-opacity="0.3"
                                    value="40"
                                    indeterminate
                                    height="25"
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
                                    class="ma-0"
                                    color="warningLight"
                                    background-color="white"
                                    background-opacity="0.3"
                                    value="40"
                                    indeterminate
                                    height="25"
                                />
                            </v-card-title>
                        </v-card>
                        <div class="empty-xs"></div>
                    </div>
                </div>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AddressQr from '@app/modules/address/components/AddressQr.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import AppAdrChip from '@app/core/components/ui/AppAdrChip.vue'
import FavHandlerHeartActions from '@app/modules/favorite-addresses/handlers/FavHandlerHeartActions.vue'
import FavHandlerEdit from '@app/modules/favorite-addresses/handlers/FavHandlerEdit.vue'
import Blockies from '@app/modules/address/components/Blockies.vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import BN from 'bignumber.js'
import { eth } from '@app/core/helper'
import { Address } from './props'
import { EnumAdrChips } from '@app/core/components/props'

@Component({
    components: {
        AddressQr,
        AppAdrChip,
        AppCopyToClip,
        Blockies,
        FavHandlerHeartActions,
        FavHandlerEdit
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
      Data
    ===================================================================================
    */
    title = ''

    /*
    ===================================================================================
        Lifecycle
    ===================================================================================
    */

    mounted() {
        this.title = this.$i18n.tc('address.name', 1).toString()
    }

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get hasChips(): boolean {
        return this.addrChips.length > 0
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

    get addrChips(): EnumAdrChips[] {
        const chips: EnumAdrChips[] = []
        if (this.address.isMiner) {
            chips.push(EnumAdrChips.miner)
        }
        if (this.address.isContractCreator) {
            chips.push(EnumAdrChips.creator)
        }
        if (this.address.isContract) {
            chips.push(EnumAdrChips.contract)
        }
        return chips
    }
    /*
    ===================================================================================
        Methods
    ===================================================================================
    */
    updateTitle(name: string): void {
        this.title = name === '' ? this.$i18n.tc('address.name', 1).toString() : `${name}`
    }
    emitErrorState(val: boolean, message: string): void {
        this.$emit('errorFavorites', val, message)
    }
}
</script>

<style scoped lang="css">
.break-hash {
    word-break: break-all;
}

p {
    margin-bottom: 0px;
}
.blocks-container {
    position: relative;
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
    width: 18vw;
    content: '';
    background: linear-gradient(to left, rgba(255, 255, 255, 1) 5%, hsla(0, 0%, 100%, 0) 80%);
}
.desktop-block {
    height: 100%;
}
</style>
