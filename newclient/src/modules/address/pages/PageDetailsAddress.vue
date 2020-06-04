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
                    <address-overview :address="addressRef" :is-miner="isMiner" :is-contractcreator="isContractCreator" :is-contract="isContract" />
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
                    <address-transfers v-if="activeTab === 'tab-0'" :address="addressRef" :max-items="max"></address-transfers>
                </v-tab-item>
                <!--
      =====================================================================================
        TOKENS INFO TAB
      =====================================================================================
      -->
                <v-tab-item slot="tabs-item" value="tab-1">
                    <!-- <table-address-tokens v-if="activeTab === 'tab-1'" :address="addressRef" /> -->
                </v-tab-item>

                <!--
      =====================================================================================
        MINER INFO TAB
      =====================================================================================
      -->
                <v-tab-item v-if="isMiner" slot="tabs-item" value="tab-3">
                    <!-- <table-blocks v-if="activeTab === 'tab-3'" :author="addressRef" :page-type="detailsType" :max-items="max" /> -->
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
const MAX_ITEMS = 10

@Component({
    components: {
        AppInfoLoad,
        AppBreadCrumbs,
        AppError,
        AddressOverview,
        AppTabs,
        AddressTransfers
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
    isMiner = false
    isContractCreator = false
    isContract = false
    error = ''
    activeTab = 'tab-0'

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
                title: this.$i18n.tc('token.name', 2),
                isActive: false
            },
            {
                id: 2,
                title: this.$i18n.tc('token.name', 2),
                isActive: false
            }
        ]

        if (!this.error) {
            if (this.isMiner) {
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

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    setMiner(value: boolean): void {
        this.isMiner = value
    }
    setContractCreator(value: boolean): void {
        this.isContractCreator = value
    }
    setContract(value: boolean): void {
        this.isContract = value
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
