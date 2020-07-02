<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-error v-if="hasError" :has-error="hasError" :message="error" />
        <!--
        =====================================================================================
          ADDRESS DETAILS
        =====================================================================================
        -->
        <div v-else>
            <v-layout row wrap justify-start class="mb-4">
                <v-flex xs12>
                    <address-overview
                        :address="addressRef"
                        :is-miner="isMiner"
                        :is-contractcreator="isContractCreator"
                        :is-contract="isContract"
                        :total-erc20-owned="totalERC20"
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
                        <address-transfers v-if="activeTab === 'tab-0'" :address="addressRef" :max-items="max"></address-transfers>
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
                            <v-layout row wrap align-center justify-start pt-2>
                                <v-btn :class="[toggleERC20 === 0 ? 'active-button' : 'button', 'pl-3 text-capitalize']" flat small @click="toggleERC20 = 0">
                                    {{ $tc('token.name', 2) }}
                                </v-btn>
                                <v-divider vertical />
                                <v-btn :class="[toggleERC20 === 1 ? 'active-button' : 'button', 'text-capitalize']" flat small @click="toggleERC20 = 1">
                                    {{ $tc('transfer.name', 2) }}
                                </v-btn>
                                <v-flex xs12 pa-1>
                                    <v-divider class="lineGrey mt-1 mb-1" />
                                </v-flex>
                            </v-layout>
                            <v-slide-x-reverse-transition>
                                <address-transfers v-show="toggleERC20 === 1" :address="addressRef" :max-items="max" transfers-type="ERC20" />
                            </v-slide-x-reverse-transition>
                            <v-slide-x-reverse-transition>
                                <address-tokens
                                    v-show="toggleERC20 === 0"
                                    :address="addressRef"
                                    :max-items="max"
                                    token-type="ERC20"
                                    @totalERC20="setTotalTokens"
                                />
                            </v-slide-x-reverse-transition>
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
                            <v-layout row wrap align-center justify-start pt-2>
                                <v-btn :class="[toggleERC721 === 0 ? 'active-button' : 'button', 'pl-3 text-capitalize']" flat small @click="toggleERC721 = 0">
                                    {{ $tc('token.name', 2) }}
                                </v-btn>
                                <v-divider vertical />
                                <v-btn :class="[toggleERC721 === 1 ? 'active-button' : 'button', 'text-capitalize']" flat small @click="toggleERC721 = 1">
                                    {{ $tc('transfer.name', 2) }}
                                </v-btn>
                                <v-flex xs12 pa-1>
                                    <v-divider class="lineGrey mt-1 mb-1" />
                                </v-flex>
                            </v-layout>
                            <v-slide-x-reverse-transition>
                                <address-transfers v-show="toggleERC721 === 1" :address="addressRef" :max-items="max" transfers-type="ERC721" />
                            </v-slide-x-reverse-transition>
                            <v-slide-x-reverse-transition>
                                <address-tokens v-show="toggleERC721 === 0" :address="addressRef" :max-items="max" token-type="ERC721" />
                            </v-slide-x-reverse-transition>
                        </div>
                    </keep-alive>

                    <!--- -->
                    <keep-alive> </keep-alive>
                </v-tab-item>
                <!--
                =====================================================================================
                  MINING HISTORY INFO TAB
                =====================================================================================
                -->
                <v-tab-item slot="tabs-item" value="tab-3">
                    <keep-alive>
                        <div>
                            <v-layout row wrap align-center justify-start pt-2>
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
                                <v-flex xs12 pa-1>
                                    <v-divider class="lineGrey mt-1 mb-1" />
                                </v-flex>
                            </v-layout>
                            <v-slide-x-reverse-transition>
                                <address-rewards
                                    v-show="toggleMiner === 0"
                                    :address="addressRef"
                                    :max-items="max"
                                    rewards-type="block"
                                    @blockRewards="setBlockRewards"
                                />
                            </v-slide-x-reverse-transition>
                            <v-slide-x-reverse-transition>
                                <address-rewards
                                    v-show="toggleMiner === 1"
                                    :address="addressRef"
                                    :max-items="max"
                                    rewards-type="uncle"
                                    @uncleRewards="setUncleRewards"
                                />
                            </v-slide-x-reverse-transition>
                            <v-slide-x-reverse-transition>
                                <address-rewards
                                    v-show="toggleMiner === 2"
                                    :address="addressRef"
                                    :max-items="max"
                                    rewards-type="genesis"
                                    @genesisRewards="setGenesisRewards"
                                />
                            </v-slide-x-reverse-transition>
                        </div>
                    </keep-alive>
                </v-tab-item>
                <!--
                =====================================================================================
                  CONTRACT CREATOR INFO TAB
                =====================================================================================
                -->
                <v-tab-item v-if="isContractCreator" slot="tabs-item" value="tab-4">
                    <!-- <table-address-contracts v-if="activeTab === 'tab-4'" :address="addressRef" /> -->
                </v-tab-item>
            </app-tabs>
        </div>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Crumb, Tab } from '@app/core/components/props'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import { eth } from '@app/core/helper'
import AddressOverview from '@app/modules/address/handlers/AddressOverview/AddressOverview.vue'
import AddressTransfers from '@app/modules/address/handlers/AddressTransfers/AddressTransfers.vue'
import AddressTokens from '@app/modules/address/handlers/AddressTokens/AddressTokens.vue'
import AddressRewards from '@app/modules/address/handlers/AddressRewards/AddressRewards.vue'
import { Address } from '@app/modules/address/components/props'
const MAX_ITEMS = 10

@Component({
    components: {
        AppInfoLoad,
        AppBreadCrumbs,
        AppError,
        AddressOverview,
        AppTabs,
        AddressTransfers,
        AddressTokens,
        AddressRewards
    }
})
export default class PageDetailsAddress extends Vue {
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
    isContractCreator = false
    isContract = false
    totalERC20 = 0
    error = ''
    activeTab = 'tab-0'
    toggleERC20 = 0
    toggleERC721 = 0
    toggleMiner = 0
    hasGenesisRewards = false
    hasUncleRewards = false
    hasBlockRewards = false

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

            if (this.isContractCreator) {
                const newTab = {
                    id: 4,
                    title: this.$i18n.tc('contract.name', 2).toString(),
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

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    setBlockRewards(value: boolean): void {
        this.hasBlockRewards = value
    }
    setUncleRewards(value: boolean): void {
        this.hasUncleRewards = value
    }
    setGenesisRewards(value: boolean): void {
        this.hasGenesisRewards = value
    }
    setContractCreator(value: boolean): void {
        this.isContractCreator = value
    }
    setContract(value: boolean): void {
        this.isContract = value
    }
    setTotalTokens(value: number): void {
        this.totalERC20 = value
    }
    /*
    ===================================================================================
      LifeCycle
    ===================================================================================
    */

    created() {
        if (!this.isValid) {
            this.error = this.$i18n.t('message.invalid.addr').toString()
            return
        }
        window.scrollTo(0, 0)
    }
}
</script>

<style scoped lang="css">
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
</style>
