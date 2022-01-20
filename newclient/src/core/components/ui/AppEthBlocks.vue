<template>
    <v-card color="primary" flat>
        <v-layout wrap align-center justify-center :class="[$vuetify.breakpoint.mdAndUp ? 'px-5 py-2' : 'px-3 py-1']">
            <v-img :src="require('@/assets/eth-blocks.png')" min-width="90px" max-width="120" contain></v-img>
            <v-flex xs12 sm6 md7 lg6>
                <div>
                    <div class="subheading font-weight-bold mb-1 white--text text-xs-center text-sm-left">{{ $t('eth-block.ad.title') }}</div>
                    <div class="white--text caption text-xs-center text-sm-left">
                        {{ $t('eth-block.ad.text') }}
                    </div>
                </div>
            </v-flex>
            <v-spacer hidden-sm-only />

            <v-btn
                depressed
                outline
                color="white"
                class="text-none mx-0"
                :href="`https://www.myetherwallet.com/wallet/dapps/eth-blocks`"
                target="_blank"
                @click="mint"
            >
                {{ $t('eth-block.ad.btn-text') }}
            </v-btn>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import { MatomoMixin } from '@app/core/components/mixins/Matomo/matomo-mixin'
import { Category, Action } from '@app/core/components/mixins/Matomo/matomoEnums'
@Component
export default class AppEthBlocks extends Mixins(MatomoMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String) category!: Category

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    mint(): void {
        this.setMatomoEvent(this.category, Action.CLICK_MINT)
    }
}
</script>
