<template>
    <div class="token-header-container">
        <!--
        =====================================================================================
          TRANSFERS HEADER
        =====================================================================================
        -->
        <v-layout v-if="isTransfers" align-center justify-start row fill-height>
            <v-flex md3>
                <h5 class="pl-3">{{ $tc('token.name', 1) }}</h5>
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
          TOKENS HEADER
        =====================================================================================
        -->
        <v-layout v-else align-center justify-start row fill-height>
            <!--
            =====================================================================================
              Name
            =====================================================================================
            -->
            <v-flex md4>
                <v-layout
                    :class="[!isTokenSortActive(0) && !isTokenSortActive(1) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <div class="token-image" />
                    <h5>{{ $t('token.tokenName') }}</h5>
                    <v-flex v-if="hasTokens" d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTokenSortActive(0)"
                                :class="[!isTokenSortActive(0) && !isTokenSortActive(1) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(1)"
                            >
                                <v-icon :class="['ml-2', isTokenSortActive(1) ? 'white--text' : '']">fas fa-sort-amount-down</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTokenSortActive(0)" flat icon @click="selectTokenFilter(1)">
                                <v-icon :class="['ml-2', isTokenSortActive(0) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="!isErc20" md2 />
            <!--
            =====================================================================================
              Amount
            =====================================================================================
            -->
            <v-flex md3>
                <v-layout
                    :class="[!isTokenSortActive(2) && !isTokenSortActive(3) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5 class="pl-1">{{ text }}</h5>
                    <v-flex v-if="hasTokens" d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTokenSortActive(3)"
                                :class="[!isTokenSortActive(2) && !isTokenSortActive(3) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(2)"
                            >
                                <v-icon :class="['ml-2', isTokenSortActive(2) ? 'white--text' : '']">fas fa-sort-amount-down</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTokenSortActive(3)" flat icon @click="selectTokenFilter(3)">
                                <v-icon :class="['ml-2', isTokenSortActive(3) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!--
            =====================================================================================
              USD VALUE
            =====================================================================================
            -->
            <v-flex v-if="isErc20" md3>
                <v-layout
                    :class="[!isTokenSortActive(4) && !isTokenSortActive(5) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5>{{ $t('usd.value') }}</h5>
                    <v-flex v-if="hasTokens" d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!isTokenSortActive(5)"
                                :class="[!isTokenSortActive(4) && !isTokenSortActive(5) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(4)"
                            >
                                <v-icon :class="['ml-2', isTokenSortActive(4) ? 'white--text' : '']">fas fa-sort-amount-down</v-icon>
                            </v-btn>
                            <v-btn v-if="isTokenSortActive(5)" flat icon @click="selectTokenFilter(5)">
                                <v-icon :class="['ml-2', isTokenSortActive(5) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!--
            =====================================================================================
              % CHANGE
            =====================================================================================
            -->
            <v-flex v-if="isErc20" md2>
                <v-layout
                    :class="[!isTokenSortActive(6) && !isTokenSortActive(7) ? 'inactive-sort' : '']"
                    grid-list-xs
                    row
                    align-center
                    justify-start
                    fill-height
                >
                    <h5>{{ $t('token.change') }}</h5>
                    <v-flex v-if="hasTokens" d-flex align-center>
                        <v-layout align-start justify-right>
                            <v-btn
                                v-if="!loading && !isTokenSortActive(7)"
                                :class="[!isTokenSortActive(6) && !isTokenSortActive(7) ? 'inactive-btn' : '']"
                                flat
                                icon
                                @click="selectTokenFilter(6)"
                            >
                                <v-icon :class="['ml-2', isTokenSortActive(6) ? 'white--text' : '']"> fas fa-sort-amount-down</v-icon>
                            </v-btn>
                            <v-btn v-if="!loading && isTokenSortActive(7)" flat icon @click="selectTokenFilter(7)">
                                <v-icon :class="['ml-2', isTokenSortActive(7) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TOKEN_FILTER_VALUES } from '@app/modules/address/models/TokenSort'

@Component
export default class TableAddressTokensHeader extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
   */
    @Prop(Boolean) isErc20!: boolean
    @Prop(Boolean) isTransfers!: boolean
    @Prop(Boolean) hasTokens!: boolean
    @Prop(Boolean) loading!: boolean

    tokenSort = 1

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Select token filter and emit to parent
     * @param _value {Number}
     */
    selectTokenFilter(_value: number): void {
        if (this.isTokenSortActive(_value)) {
            if (_value % 2 == 0) {
                _value = _value + 1
            } else {
                _value = _value - 1
            }
        }
        this.tokenSort = _value
        this.$emit('sortBy', TOKEN_FILTER_VALUES[this.tokenSort])
    }
    /**
     * Check if token filter is active
     * @param _value {Number}
     * @returns {Boolean}
     */
    isTokenSortActive(_value: number): boolean {
        return this.tokenSort === _value
    }

    /*
    ===================================================================================
      Computed
    ===================================================================================
   */
    get text(): string {
        return this.isErc20 ? `${this.$t('common.amount')}` : `${this.$t('token.total-tokens')}`
    }
}
</script>
<style scoped lang="scss">
.token-header-container {
    height: 100%;
    .v-btn.v-btn--flat.v-btn--icon {
        height: 16px;
        width: 16px;
        margin: 0;
        .v-icon {
            font-size: 18px !important;
        }
    }
    .inactive-sort {
        .inactive-btn {
            color: transparent;
        }
        &:hover {
            .v-icon {
                color: #b4bfd2;
                display: block;
            }
        }
    }
}
</style>
