<template>
    <v-layout align-center fill-height justify-end row height="48px" class="module-search pl-1">
        <v-flex xs12 md12>
            <v-card flat class="search-input-container">
                <v-layout fill-height align-center justify-end>
                    <v-select
                        v-model="selectVal"
                        :flat="true"
                        :solo="true"
                        :items="selectItems"
                        class="search-select"
                        height="48"
                        append-icon="fa fa-chevron-down secondary--text"
                    />
                    <v-combobox
                        v-model="searchVal"
                        :loading="isLoading"
                        :items="items"
                        :search-input.sync="searchAutocomplete"
                        :prepend-inner-icon="getIcon"
                        :placeholder="$t('search.default')"
                        item-value="contract"
                        item-text="keyword"
                        hide-no-data
                        clearable
                        solo
                        flat
                        append-icon=""
                        height="48px"
                        @keyup.enter="onSearch"
                        @click:clear="searchVal = ''"
                        @change="onSelect"
                    ></v-combobox>
                </v-layout>
            </v-card>
        </v-flex>
        <v-flex hidden-sm-and-down md4 class="search-button-container">
            <v-btn depressed color="secondary" class="search-button text-capitalize ml-0" @click="onSearch">{{ $t('search.name') }}</v-btn>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

const selectTypes = ['all', 'token-detail']

@Component
export default class Search extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */
    @Prop({ type: Array }) selectItems!: any[]
    @Prop({ type: Array }) items!: any[]
    @Prop({ type: Boolean }) isLoading!: string
    @Prop({ type: Boolean }) hasError!: boolean

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    searchAutocomplete = ''
    searchVal = ''
    selectVal = selectTypes[0]
    snackbar = false
    searchTimeout = 0

    /*
  ===================================================================================
    Watch
  ===================================================================================
  */

    @Watch('searchAutocomplete')
    search(newVal: string, oldVal: string): void {
        if (newVal && (this.selectVal === selectTypes[0] || this.selectVal === selectTypes[1])) {
            this.$emit('getAllSearch', newVal)
        }
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Emits received value to parent
     * @param param {Any}
     */
    onSelect(param): void {
        this.$emit('onSelect', param)
    }
    /**
     * Emits received value to parent
     * @param param {Any}
     */
    onSearch(param): void {
        if (this.selectVal === selectTypes[0]) {
            clearTimeout(this.searchTimeout)
            this.searchTimeout = window.setTimeout(() => {
                this.$emit('getAllSearch', this.searchVal)
            }, 500)
        } else {
            this.searchTimeout = window.setTimeout(() => {
                this.$emit('routeTo', this.selectVal, this.searchVal)
            }, 500)
        }
    }
    /**
     * Resets search and selected values
     */
    resetValues() {
        this.searchVal = ''
        this.selectVal = selectTypes[0]
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get getIcon(): string {
        return !this.hasError ? 'fa fa-search grey--text text--lighten-1 pr-4 pl-4' : 'fa fa-search error--text pr-4 pl-4'
    }
}
</script>
<style lang="scss">
.module-search {
    .search-input-container {
        height: 48px;
        .search-select {
            height: 100%;
            max-width: 117px;
            padding-top: 0;

            .v-input__control {
                .v-input__slot {
                    border: 1px solid #b5c0d3 !important;
                    border-radius: 2px 0 0 2px;
                    min-height: 48px;
                    padding-left: 20px;

                    .v-icon {
                        font-size: 12px;
                        padding-right: 15px;
                    }
                }
                .v-input__slot:before {
                    border: none;
                }

                .v-select__slot {
                    .v-label {
                        font-size: 14px;
                    }
                }
            }
        }

        .v-text-field {
            .v-input__slot {
                border-bottom: 1px solid #b5c0d3 !important;
                border-top: 1px solid #b5c0d3 !important;
                border-right: 1px solid #b5c0d3 !important;
                border-radius: 0;
                font-size: 14px;

                .v-icon {
                    font-size: 16px;
                }
            }
        }
    }

    .search-button-container {
        max-width: 115px !important;

        .search-button {
            border-radius: 0 2px 2px 0;
        }
    }
}
</style>
