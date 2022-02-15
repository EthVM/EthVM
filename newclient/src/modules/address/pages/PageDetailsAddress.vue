<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-eth-blocks class="mb-4" :category="matomoEthBlockCategory" />
        <app-error v-if="hasError" :has-error="hasError" :message="error" />
        <!--
        =====================================================================================
          ADDRESS DETAILS
        =====================================================================================
        -->
        <div v-else>
            <app-message :messages="errorMessages" />
            <v-layout row wrap justify-start class="mb-4">
                <v-flex xs12>
                    <address-overview
                        :address="addressRef"
                        :is-miner="isMiner"
                        :is-contract-creator="isContractCreator"
                        :is-contract="isContract"
                        :total-erc20-owned="totalERC20"
                        :update-balance="addrBalanceChanged"
                        :set-contract-creator="setContractCreator"
                        :loading-tokens="loadingERC20Balance"
                        @resetBalanceUpdate="resetBalance"
                        @errorAddrOverview="setError"
                    />
                </v-flex>
            </v-layout>
            <!--
            =====================================================================================
            ADDRESS TABS
            =====================================================================================
            -->
            <app-tabs :tabs="tabs" @changeTab="activeTab = $event">
                <!--
                =====================================================================================
                  TRANSACTIONS INFO TAB
                =====================================================================================
                -->
                <v-tab-item slot="tabs-item" value="tab-0">
                    <keep-alive>
                        <div>
                            <v-layout :class="subMenuClass" row wrap align-center justify-start>
                                <v-btn :class="[toggleLastTx === 0 ? 'active-button' : 'button', 'pl-3 text-capitalize']" flat small @click="toggleLastTx = 0">
                                    {{ $tc('btn.last', 2) }}
                                </v-btn>
                                <v-divider vertical />
                                <v-btn :class="[toggleLastTx === 1 ? 'active-button' : 'button', 'pl-1 text-capitalize']" flat small @click="toggleLastTx = 1">
                                    {{ $tc('common.pending', 2) }}
                                </v-btn>
                                <v-flex xs12 pr-0 pl-0 pt-1 pb-1>
                                    <v-divider class="lineGrey mt-1 mb-1" />
                                </v-flex>
                            </v-layout>
                            <transition name="tab-fade">
                                <address-transfers
                                    v-show="toggleLastTx === 0"
                                    :address="addressRef"
                                    :max-items="max"
                                    :is-contract="isContract"
                                    :loading-contract="loadingContract"
                                    :new-transfers="newETHTransfers"
                                    @resetUpdateCount="setNewEvent"
                                    @errorTransfers="setError"
                                ></address-transfers>
                            </transition>
                            <transition name="tab-fade">
                                <address-pending-tx v-show="toggleLastTx === 1" :address="addressRef" :max-items="max" @errorPending="setError" />
                            </transition>
                        </div>
                    </keep-alive>
                </v-tab-item>
                <!--
                =====================================================================================
                  ERC20 TOKENS INFO TAB
                =====================================================================================
                -->
                <v-tab-item slot="tabs-item" value="tab-1">
                    <keep-alive>
                        <div>
                            <v-layout :class="subMenuClass" row wrap align-center justify-start pt-2>
                                <v-btn :class="[toggleERC20 === 0 ? 'active-button' : 'button', 'pl-3 text-capitalize']" flat small @click="toggleERC20 = 0">
                                    {{ $tc('token.name', 2) }}
                                </v-btn>
                                <v-divider vertical />
                                <v-btn :class="[toggleERC20 === 1 ? 'active-button' : 'button', 'text-capitalize']" flat small @click="toggleERC20 = 1">
                                    {{ $tc('transfer.name', 2) }}
                                </v-btn>
                                <v-flex xs12 pr-0 pl-0 pt-1 pb-1>
                                    <v-divider class="lineGrey mt-1 mb-1" />
                                </v-flex>
                            </v-layout>
                            <transition name="tab-fade">
                                <address-transfers
                                    v-show="toggleERC20 === 1"
                                    :address="addressRef"
                                    :max-items="max"
                                    :new-transfers="newERC20Transfers"
                                    :refetch-transfers="refetchERC20Transfers"
                                    transfers-type="ERC20"
                                    @resetUpdateCount="setNewEvent"
                                    @resetTransfersRefetch="resetTransfersRefetch(true)"
                                    @errorTransfers="setError"
                                />
                            </transition>
                            <transition name="tab-fade">
                                <address-tokens
                                    v-show="toggleERC20 === 0"
                                    :address="addressRef"
                                    :max-items="max"
                                    :new-tokens="newERC20Transfers"
                                    :refetch-tokens="refetchERC20Balance"
                                    token-type="ERC20"
                                    @totalERC20="setTotalTokens"
                                    @resetUpdateCount="setNewEvent"
                                    @loadingERC20Tokens="setLoadingERC20"
                                    @resetBalanceRefetch="resetBalanceRefetch(true)"
                                    @errorTokenBalance="setError"
                                />
                            </transition>
                        </div>
                    </keep-alive>
                </v-tab-item>
                <!--
                =====================================================================================
                  ERC721 TOKENS INFO TAB
                =====================================================================================
                -->
                <v-tab-item slot="tabs-item" value="tab-2">
                    <keep-alive>
                        <div>
                            <v-layout :class="subMenuClass" row wrap align-center justify-start pt-2>
                                <v-btn :class="[toggleERC721 === 0 ? 'active-button' : 'button', 'pl-3 text-capitalize']" flat small @click="toggleERC721 = 0">
                                    {{ $tc('token.name', 2) }}
                                </v-btn>
                                <v-divider vertical />
                                <v-btn :class="[toggleERC721 === 1 ? 'active-button' : 'button', 'text-capitalize']" flat small @click="toggleERC721 = 1">
                                    {{ $tc('transfer.name', 2) }}
                                </v-btn>
                                <v-flex xs12 pr-0 pl-0 pt-1 pb-1>
                                    <v-divider class="lineGrey mt-1 mb-1" />
                                </v-flex>
                            </v-layout>
                            <transition name="tab-fade">
                                <address-transfers
                                    v-show="toggleERC721 === 1"
                                    :address="addressRef"
                                    :max-items="max"
                                    :new-transfers="newERC721Transfers"
                                    :refetch-transfers="refetchERC721Transfers"
                                    transfers-type="ERC721"
                                    @resetUpdateCount="setNewEvent"
                                    @resetTransfersRefetch="resetTransfersRefetch(false)"
                                    @errorTransfers="setError"
                                />
                            </transition>
                            <transition name="tab-fade">
                                <address-tokens
                                    v-show="toggleERC721 === 0"
                                    :address="addressRef"
                                    :max-items="max"
                                    :new-tokens="newERC721Transfers"
                                    :refetch-tokens="refetchERC721Balance"
                                    token-type="ERC721"
                                    @resetUpdateCount="setNewEvent"
                                    @resetBalanceRefetch="resetBalanceRefetch(false)"
                                    @errorTokenBalance="setError"
                                />
                            </transition>
                        </div>
                    </keep-alive>

                    <!--- -->
                    <keep-alive> </keep-alive>
                </v-tab-item>
                <!--
                =====================================================================================
                  CONTRACT CREATOR INFO TAB
                =====================================================================================
                -->
                <v-tab-item slot="tabs-item" value="tab-3">
                    <keep-alive>
                        <address-contract-info :address="addressRef" :set-contract="setContract" />
                    </keep-alive>
                </v-tab-item>
                <!--
                =====================================================================================
                  MINING HISTORY INFO TAB
                =====================================================================================
                -->
                <v-tab-item slot="tabs-item" :value="isContract ? 'tab-4' : 'tab-3'">
                    <keep-alive>
                        <div>
                            <v-layout :class="subMenuClass" row wrap align-center justify-start pt-2>
                                <v-btn
                                    v-if="hasBlockRewards"
                                    :class="[toggleMiner === 0 ? 'active-button' : 'button', 'ml-3 text-capitalize']"
                                    flat
                                    small
                                    @click="toggleMiner = 0"
                                >
                                    {{ $tc('block.name', 2) }}
                                </v-btn>
                                <v-divider v-if="hasUncleRewards" vertical />
                                <v-btn
                                    v-if="hasUncleRewards"
                                    :class="[toggleMiner === 1 ? 'active-button' : 'button', 'text-capitalize']"
                                    flat
                                    small
                                    @click="toggleMiner = 1"
                                >
                                    {{ $tc('uncle.name', 2) }}
                                </v-btn>
                                <v-divider v-if="hasGenesisRewards" vertical />
                                <v-btn
                                    v-if="hasGenesisRewards"
                                    :class="[toggleMiner === 2 ? 'active-button' : 'button', 'text-capitalize']"
                                    flat
                                    small
                                    @click="toggleMiner = 2"
                                >
                                    {{ $t('miner.reward.genesis') }}
                                </v-btn>
                                <v-flex xs12 pr-0 pl-0 pt-1 pb-1>
                                    <v-divider class="lineGrey mt-1 mb-1" />
                                </v-flex>
                            </v-layout>
                            <!--
                            =====================================================================================
                              BLOCK REWARDS TABLE
                            =====================================================================================
                            -->
                            <transition name="tab-fade">
                                <address-rewards
                                    v-show="toggleMiner === 0"
                                    :address="addressRef"
                                    :max-items="max"
                                    :new-rewards="newMinedBlocks"
                                    rewards-type="block"
                                    @blockRewards="setBlockRewards"
                                    @resetUpdateCount="setNewEvent"
                                    @errorRewards="setError"
                                />
                            </transition>
                            <!--
                            =====================================================================================
                              UNCLE REWARDS TABLE
                            =====================================================================================
                            -->
                            <transition name="tab-fade">
                                <address-rewards
                                    v-show="toggleMiner === 1"
                                    :address="addressRef"
                                    :max-items="max"
                                    :new-rewards="newMinedUncles"
                                    rewards-type="uncle"
                                    @uncleRewards="setUncleRewards"
                                    @resetUpdateCount="setNewEvent"
                                    @errorRewards="setError"
                                />
                            </transition>
                            <!--
                            =====================================================================================
                              GENESIS REWARDS TABLE
                            =====================================================================================
                            -->
                            <transition name="tab-fade">
                                <address-rewards
                                    v-show="toggleMiner === 2"
                                    :address="addressRef"
                                    :max-items="max"
                                    rewards-type="genesis"
                                    @genesisRewards="setGenesisRewards"
                                    @errorRewards="setError"
                                />
                            </transition>
                        </div>
                    </keep-alive>
                </v-tab-item>
            </app-tabs>
        </div>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppEthBlocks from '@app/core/components/ui/AppEthBlocks.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import { AddressUpdateEvent } from '@app/modules/address/handlers/AddressUpdateEvent/AddressUpdateEvent.mixin'
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { Detail, Crumb, Tab } from '@app/core/components/props'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import { eth } from '@app/core/helper'
import AddressPendingTx from '@app/modules/address/handlers/AddressPendingTx/AddressPendingTx.vue'
import AddressOverview from '@app/modules/address/handlers/AddressOverview/AddressOverview.vue'
import AddressTransfers from '@app/modules/address/handlers/AddressTransfers/AddressTransfers.vue'
import AddressTokens from '@app/modules/address/handlers/AddressTokens/AddressTokens.vue'
import AddressRewards from '@app/modules/address/handlers/AddressRewards/AddressRewards.vue'
import AddressContractInfo from '@app/modules/address/handlers/AdressContractInfo/AddressContractInfo.vue'
import { Address, Contract } from '@app/modules/address/components/props'
import { ErrorMessage } from '@app/modules/address/models/ErrorMessagesForAddress'
import { Category } from '@app/core/components/mixins/Matomo/matomoEnums'

const MAX_ITEMS = 10

@Component({
    components: {
        AppInfoLoad,
        AppBreadCrumbs,
        AppError,
        AppMessage,
        AddressOverview,
        AppTabs,
        AddressTransfers,
        AddressTokens,
        AddressRewards,
        AddressPendingTx,
        AppEthBlocks,
        AddressContractInfo
    }
})
export default class PageDetailsAddress extends Mixins(AddressUpdateEvent) {
    /*
    ===================================================================================
      Props
    ===================================================================================
   */

    @Prop({ type: String, default: '' }) addressRef!: string

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    loadingContract = true
    isContractCreator = false
    isContract = false
    error = ''
    activeTab = 'tab-0'
    toggleERC20 = 0
    toggleERC721 = 0
    toggleMiner = 0
    toggleLastTx = 0
    hasGenesisRewards = false
    hasUncleRewards = false
    hasBlockRewards = false
    errorMessages: ErrorMessage[] = []
    contract!: Contract
    matomoEthBlockCategory = Category.ADR_PAGE

    /* ERC20 and ERC721 Refetc options */
    totalERC20 = 0
    loadingERC20Balance = true

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get isValid(): boolean {
        return eth.isValidAddress(this.addressRef)
    }

    get hasError(): boolean {
        return this.error !== ''
    }

    get max(): number {
        return MAX_ITEMS
    }

    get crumbs(): Crumb[] {
        return [
            {
                text: this.$tc('address.name', 1),
                hash: this.addressRef
            }
        ]
    }

    get tabs(): Tab[] {
        const tabs: Tab[] = [
            {
                id: 0,
                title: this.$i18n.t('tx.history'),
                isActive: true
            },
            {
                id: 1,
                title: this.$i18n.t('token.erc20'),
                isActive: false
            },
            {
                id: 2,
                title: this.$i18n.t('token.nft'),
                isActive: false
            }
        ]

        if (!this.error) {
            if (this.showMiningRewards) {
                const newTab = {
                    id: 3,
                    title: this.$i18n.t('miner.history').toString(),
                    isActive: false
                }
                tabs.push(newTab)
            }

            if (this.isContract) {
                const newTab = {
                    id: this.showMiningRewards ? 4 : 3,
                    title: this.$i18n.tc('contract.name', 1).toString(),
                    isActive: false
                }
                tabs.push(newTab)
            }
        }

        return tabs
    }

    get isMiner(): boolean {
        return this.hasBlockRewards || this.hasUncleRewards
    }
    get showMiningRewards(): boolean {
        return this.isMiner || this.hasGenesisRewards
    }
    get subMenuClass(): string {
        return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm' ? 'pt-3' : 'pt-2'
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets Block Rewards
     * @param value {Boolean}
     */
    setBlockRewards(value: boolean): void {
        this.hasBlockRewards = value
    }
    /**
     * Sets Uncle Rewards
     * @param value {Boolean}
     */
    setUncleRewards(value: boolean): void {
        this.hasUncleRewards = value
    }
    /**
     * Sets Genesis Rewards
     * @param value {Boolean}
     */
    setGenesisRewards(value: boolean): void {
        this.hasGenesisRewards = value
    }
    /**
     * Sets Contract Creator
     * @param value {Boolean}
     */
    setContractCreator(value: boolean): void {
        this.isContractCreator = value
    }
    /**
     * Sets Contract
     * @param value {Boolean}
     */
    setContract(value: boolean): void {
        this.isContract = value
        this.loadingContract = false
    }
    /**
     * Sets Total Tokens
     * @param value {Number}
     */
    setTotalTokens(value: number): void {
        this.totalERC20 = value
    }

    /**
     * Set LoadingERC20 state
     * @param _value {Boolean}
     */
    setLoadingERC20(_value: boolean): void {
        this.loadingERC20Balance = _value
    }

    /* Errors Events :*/
    /**
     * Set Errors
     * @param hasError {Boolean}
     * @param message {ErrorMessage}
     */
    setError(hasError: boolean, message: ErrorMessage): void {
        if (hasError) {
            if (!this.errorMessages.includes(message)) {
                this.errorMessages.push(message)
            }
        } else {
            if (this.errorMessages.length > 0) {
                const index = this.errorMessages.indexOf(message)
                if (index > -1) {
                    this.errorMessages.splice(index, 1)
                }
            }
        }
    }
    /*
    ===================================================================================
      LifeCycle
    ===================================================================================
    */

    created() {
        if (!this.isValid) {
            this.error = this.$i18n.t('message.invalid.addr').toString()
        } else {
            this.setEventVariables(this.addressRef)
        }

        window.scrollTo(0, 0)
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('hasUpdateError')
    onHasUpdateErrorChanged(newVal: boolean): void {
        this.setError(newVal, ErrorMessage.updateEvent)
    }
}
</script>

<style scoped lang="scss">
.active-button {
    color: #3d55a5;
    margin: 0px 10px;
    padding: 4px;
    min-width: 30px;
}
.button {
    min-width: 30px;
    color: #8391a8;
    margin: 0px 10px;
    padding: 4px;
}
.divider {
    height: 24px;
}

.tab-fade-enter /* .tab-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

.tab-fade-enter-active {
    transition: all 0.5s ease-in;
}
.tab-fade-enter-to {
    opacity: 1;
}
.tab-fade-leave,
.tab-fade-leave-active,
.tab-fade-leave-to {
    display: none;
}
</style>
