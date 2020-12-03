<template>
    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->

    <v-layout align-center justify-start row fill-height>
        <!--
        =====================================================================================
          TOKEN NAME/IMAGE

          Responsive Tally:
          MD: 4/12 (4)
        =====================================================================================
        -->
        <v-flex sm4>
            <v-layout :class="[!isActive(0) && !isActive(1) ? 'inactive-sort' : '']" align-center justify-start row pl-3>
                <h5 class="pl-5 pr-2">{{ $tc('token.name', 1) }}</h5>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right>
                        <v-btn v-if="!loading && !isActive(1)" :class="[!isActive(0) && !isActive(1) ? 'inactive-btn' : '']" flat icon @click="selectFilter(0)">
                            <v-icon :class="[isActive(0) ? 'white--text' : '']">fas fa-sort-amount-down</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(1)" flat icon @click="selectFilter(1)">
                            <v-icon :class="[isActive(1) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <!--
        =====================================================================================
          Price

          Responsive Tally:
          MD: 6/12 (2)
        =====================================================================================
        -->
        <v-flex sm2>
            <v-layout :class="[!isActive(2) && !isActive(3) ? 'inactive-sort' : '']" align-center justify-start row>
                <h5 class="px-2">{{ $tc('price.name', 1) }}</h5>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right>
                        <v-btn v-if="!loading && !isActive(3)" :class="[!isActive(2) && !isActive(3) ? 'inactive-btn' : '']" flat icon @click="selectFilter(2)">
                            <v-icon :class="[isActive(2) ? 'white--text' : '']">fas fa-sort-amount-down</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(3)" flat icon @click="selectFilter(3)">
                            <v-icon :class="[isActive(3) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <!--
        =====================================================================================
          %Change

          Responsive Tally:
          MD: 8/12 (2)
        =====================================================================================
        -->
        <v-flex sm2>
            <h5>{{ $t('token.change') }}</h5>
        </v-flex>
        <!--
        =====================================================================================
          Volume

          Responsive Tally:
          MD: 10/12 (2)
        =====================================================================================
        -->
        <v-flex sm2>
            <v-layout :class="[!isActive(4) && !isActive(5) ? 'inactive-sort' : '']" align-center justify-start row>
                <h5 class="px-2">{{ $t('token.volume') }}</h5>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right>
                        <v-btn v-if="!loading && !isActive(5)" :class="[!isActive(4) && !isActive(5) ? 'inactive-btn' : '']" flat icon @click="selectFilter(4)">
                            <v-icon :class="[isActive(4) ? 'white--text' : '']">fas fa-sort-amount-down</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(5)" flat icon @click="selectFilter(5)">
                            <v-icon :class="[isActive(5) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <!--
        =====================================================================================
          Market Cap

          Responsive Tally:
          MD: 12/12 (2)
        =====================================================================================
        -->
        <v-flex sm2>
            <v-layout :class="[!isActive(6) && !isActive(7) ? 'inactive-sort' : '']" align-center justify-start row>
                <h5 class="pr-2">{{ $t('token.market') }}</h5>
                <v-flex d-flex align-center>
                    <v-layout align-start justify-right>
                        <v-btn v-if="!loading && !isActive(7)" :class="[!isActive(6) && !isActive(7) ? 'inactive-btn' : '']" flat icon @click="selectFilter(6)">
                            <v-icon :class="[isActive(6) ? 'white--text' : '']">fas fa-sort-amount-down</v-icon>
                        </v-btn>
                        <v-btn v-if="!loading && isActive(7)" flat icon @click="selectFilter(7)">
                            <v-icon :class="[isActive(7) ? 'white--text' : '']">fas fa-sort-amount-up</v-icon>
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
// import TokenFilter from '@app/modules/tokens/components/TokenFilter.vue'

import { Component, Prop, Vue } from 'vue-property-decorator'

const FILTER_VALUES = ['name_high', 'name_low', 'price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']

@Component({
    components: {
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
    @Prop(Boolean) loading!: boolean

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Select filter and emit to parent
     * @param _value {Number}
     */
    selectFilter(_value: number): void {
        if (this.isActive(_value)) {
            if (_value % 2 == 0) {
                _value = _value + 1
            } else {
                _value = _value - 1
            }
        }
        this.$emit('sortBy', FILTER_VALUES[_value])
    }
    /**
     * Check if filter is active
     * @param _value {Number}
     * @returns {Boolean}
     */
    isActive(_value: number): boolean {
        return this.selectedFilter === _value
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get selectedFilter(): number {
        return FILTER_VALUES.indexOf(this.sort)
    }
}
</script>

<style scoped lang="scss">
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
</style>
