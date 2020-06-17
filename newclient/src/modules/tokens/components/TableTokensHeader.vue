<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout row wrap fill-height align-center justify-start>
        <v-flex hidden-xs-only sm12>
            <v-layout align-center justify-start row fill-height pr-3>
                <v-flex hidden-xs-only sm4 pl-2>
                    <v-layout align-center justify-start row pl-1>
                        <h5 class="pl-5 pr-2">{{ $tc('token.name', 1) }}</h5>
                        <v-flex>
                            <v-layout align-start justify-center column>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(0)">
                                    <v-icon :class="[isActive(0) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-up</v-icon>
                                </v-btn>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(1)">
                                    <v-icon :class="[isActive(1) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-down</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex hidden-xs-only sm2>
                    <v-layout align-center justify-start row pl-1>
                        <h5 class="pr-2">{{ $tc('price.name', 1) }}</h5>
                        <v-flex>
                            <v-layout align-start justify-center column>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(2)">
                                    <v-icon :class="[isActive(2) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-up</v-icon>
                                </v-btn>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(3)">
                                    <v-icon :class="[isActive(3) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-down</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex hidden-xs-only sm2 pl-0>
                    <h5>{{ $t('token.change') }}</h5>
                </v-flex>
                <v-flex hidden-xs-only sm2>
                    <v-layout align-center justify-start row pl-2>
                        <h5 class="pr-1">{{ $t('token.volume') }}</h5>
                        <v-flex>
                            <v-layout align-start justify-center column>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(4)">
                                    <v-icon :class="[isActive(4) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-up</v-icon>
                                </v-btn>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(5)">
                                    <v-icon :class="[isActive(5) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-down</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex hidden-xs-only sm2>
                    <v-layout align-center justify-start row pl-2>
                        <h5 class="pr-1">{{ $t('token.market') }}</h5>
                        <v-flex>
                            <v-layout align-start justify-center column>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(6)">
                                    <v-icon :class="[isActive(6) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-up</v-icon>
                                </v-btn>
                                <v-btn :disabled="hasError || loading" flat icon @click="selectFilter(7)">
                                    <v-icon :class="[isActive(7) ? 'white--text' : 'bttnToken--text']" small>fas fa-caret-down</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex hidden-sm-and-up xs12 mr-1 ml-1>
            <!-- <token-filter @filterMobile="selectFilter" /> -->
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
// import TokenFilter from '@app/modules/tokens/components/TokenFilter.vue'

import { Component, Prop, Vue } from 'vue-property-decorator'

const FILTER_VALUES = ['name_high', 'name_low', 'price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']

@Component({
    components: {
        AppError,
        AppPaginate,
        AppTableTitle
        // TokenFilter,
    }
})
export default class TableTokensHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String!) sort!: string
    @Prop(String!) error!: string
    @Prop(Boolean) loading!: boolean

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    selectFilter(_value: number): void {
        this.$emit('sortBy', FILTER_VALUES[_value])
    }

    isActive(_value: number): boolean {
        return this.selectedFilter === _value
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get hasError(): boolean {
        return this.error !== ''
    }

    get selectedFilter(): number {
        return FILTER_VALUES.indexOf(this.sort)
    }
}
</script>

<style scoped lang="css">
.v-btn.v-btn--flat.v-btn--icon {
    height: 12px;
    width: 12px;
    margin: 0;
}
</style>
