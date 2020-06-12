<template>
    <div>
        <!--
        =====================================================================================
          TRANSFERS HEADER
        =====================================================================================
        -->
        <v-layout v-if="isTransfers" align-center justify-start row fill-height>
            <v-flex md3>
                <h5 class="pl-3">{{ this.$tc('token.name', 1) }}</h5>
            </v-flex>
            <v-spacer />
            <v-flex md3>
                <h5>{{ text }}</h5>
            </v-flex>
            <v-flex md2>
                <h5>{{ $t('common.age') }}</h5>
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          TRANSFERS HEADER
        =====================================================================================
        -->
        <v-layout v-else align-center justify-start row fill-height>
            <v-flex md4>
                <v-layout grid-list-xs row align-center justify-start fill-height>
                    <div class="token-image" />
                    <h5>{{ $t('token.tokenName') }}</h5>
                </v-layout>
            </v-flex>
            <v-flex md3>
                <h5>{{ text }}</h5>
            </v-flex>
            <v-flex v-if="isErc20" md3>
                <h5>{{ $t('usd.value') }}</h5>
            </v-flex>
            <v-flex v-if="isErc20" md2>
                <h5>{{ $t('token.change') }}</h5>
            </v-flex>
            <v-spacer v-else />
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TableAddressTokensHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
   */
    @Prop(Boolean) isErc20!: boolean
    @Prop(Boolean) isTransfers!: boolean

    /*
    ===================================================================================
      Computed
    ===================================================================================
   */

    get text(): string {
        return this.isErc20 ? `${this.$t('common.amount')}` : 'Token ID'
    }
}
</script>
