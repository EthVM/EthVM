<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <div class="nebula mb-5 rounded-xl d-flex align-center justify-center">
                    <v-img :src="require('@/assets/hero/hero-group.png')" alt="" :max-height="xs ? '150' : '300'" />
                </div>
                <p class="text-h5 font-weight-bold mb-3">What is ethVM?</p>
                <p class="mb-15">
                    ethVM is a block explorer made by people that put user experience first. We made EthVM so that normal users can monitor blockchain
                    transactions, view portfolio analytics, and even explore NFT collections without feeling like they are doing their taxes…or even worse:
                    using Excel. It is an open source platform that empowers users to do more when it comes to crypto!
                </p>
                <p class="text-h5 font-weight-bold mb-3">Who are we?</p>
                <div class="d-flex align-end justify-start mb-3">
                    <v-img
                        :src="require('@/assets/logo/mew-long.svg')"
                        alt=""
                        min-height="30"
                        min-width="50"
                        max-width="144"
                        max-height="37"
                        contain
                        class="mr-3"
                    />
                    <p>ethVM is made by the MyEtherWallet team!</p>
                </div>
                <p class="mb-15">
                    MEW was the first wallet interface in Ethereum and was founded 2 weeks after Ethereum mainnet went live. You can basically call us a crypto
                    OG. Ever since our founding, our mission has been to make products that people love to use.
                </p>
                <p class="text-h5 font-weight-bold mb-3">Why did we make ethVM?</p>
                <p class="mb-15">
                    We made ethVM so that users, developers, and communities have a beautiful choice when it comes to block explorers. ethVM is open source,
                    which makes it adaptable to any crypto ecosystem. So whether you want a better way to track your contract approvals or a solution for an
                    ambitious new project - this is for you!
                </p>

                <p>SSPL License, Copyright © 2023 MyEtherWallet Inc. For Terms & conditions visit our GitHub.</p>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs } = useDisplay()
onMounted(() => {
    window.scrollTo(0, 0)
})

const { columnPadding, rowMargin } = useAppViewGrid()
</script>
<style lang="scss" scoped>
.nebula {
    @media (max-width: 599px) {
        background: url('/src/assets/nebula/nebula-bg-xs.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        height: 200px !important;
    }
    @media only screen and (min-width: 600px) and (max-width: 904px) {
        background: url('/src/assets/nebula/nebula-bg-sm.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    @media only screen and (min-width: 905px) and (max-width: 1239px) {
        background: url('/src/assets/nebula/nebula-bg-md.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    @media (min-width: 1240px) {
        background: url('/src/assets/nebula/nebula-bg-lg.png');
        background-position: right 35% center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    background-attachment: fixed;
    height: 340px;
    width: 100%;
    background-color: rgb(var(--v-theme-primary)) !important;
}
</style>
