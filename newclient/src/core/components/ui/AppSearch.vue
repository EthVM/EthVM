<template>
    <v-layout align-center fill-height justify-end row height="48px" class="app-search pl-1">
        <v-flex xs12 md12>
            <v-card flat class="search-input-container">
                <v-layout fill-height align-center justify-end>
                    <v-select
                        :flat="true"
                        :solo="true"
                        :items="selectItems"
                        v-model="selectValue"
                        height="48"
                        append-icon="fa fa-chevron-down secondary--text"
                    />
                    <v-autocomplete
                        :prepend-inner-icon="getIcon"
                        :items="items"
                        v-model="searchInput"
                        :search-input.sync="searchAutocomplete"
                        append-icon=""
                        @keyup.enter="onSearch"
                    ></v-autocomplete>
                    <!-- <v-text-field
                        v-if="phText === 'default'"
                        v-model="searchInput"
                        :placeholder="$t('search.default')"
                        :prepend-inner-icon="getIcon"
                        color="primary"
                        solo
                        flat
                        clearable
                        spellcheck="false"
                        class="ma-0"
                        height="48px"
                        @keyup.enter="onSearch"
                        @click:clear="resetValues"
                    />
                    <v-text-field
                        v-if="phText === 'addressTxSearch'"
                        :placeholder="$t('search.address-tx')"
                        dense
                        flat
                        color="primary"
                        solo
                        clearable
                        spellcheck="false"
                        prepend-inner-icon="fa fa-search grey--text text--lighten-1 pr-4 pl-4"
                        class="ma-0"
                        height="34px"
                        @keyup.enter="onSearch"
                    /> -->
                </v-layout>
            </v-card>
        </v-flex>
        <v-flex hidden-sm-and-down md4 class="search-button-container">
            <v-btn v-if="phText === 'default'" depressed color="secondary" class="search-button text-capitalize ml-0" @click="onSearch">{{
                $t('search.name')
            }}</v-btn>
            <v-btn v-else depressed outline class="search-button text-capitalize ml-0 primary--text lineGrey" @click="onSearch">{{ $t('search.name') }}</v-btn>
        </v-flex>
        <v-snackbar v-model="snackbar" :bottom="true" :right="true" :timeout="5000">
            {{ $t('search.no-result') }}
            <v-btn color="primary" text @click="snackbar = false">
                {{ $t('common.close') }}
            </v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { eth } from '@app/core/helper'
import { getTokensBeginsWith, getHashType } from '@app/core/components/handlers/appSearch.graphql'

@Component
export default class AppSearch extends Vue {
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    searchInput = ''
    phText = 'default'
    isValid = true
    snackbar = false
    selectValue = 'all'

    /*
  ===================================================================================
    Watch
  ===================================================================================
  */

    @Watch('searchAutocomplete')
    searchAutocomplete(newVal: string, oldVal: string): void {
        console.error('newval', newVal, oldVal)
        if (newVal === null || newVal === '') {
            this.resetValues()
        }
    }

    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    onSearch(): void {
        console.log('hello', this.searchInput)
        if (this.selectValue === 'all') {
            ;/^[a-zA-Z]+$/.test(this.searchInput) ? this.getToken() : this.getHashType()
        } else {
            const route = { name: this.selectValue, params: this.getParam(this.selectValue) }
            this.$router.push(route)
            this.searchInput = ''
        }
    }

    resetValues(): void {
        this.isValid = true
    }

    getToken(): any {
        this.$apollo
            .query({
                query: getTokensBeginsWith,
                variables: {
                    keyword: this.searchInput
                }
            })
            .then(response => {
                console.error('response', response)
            })
            .catch(err => {
                console.error('err', err)
            })
    }

    getHashType(): any {
        let routeName = ''
        this.$apollo
            .query({
                query: getHashType,
                variables: {
                    hash: this.searchInput
                }
            })
            .then(response => {
                const hashType = response.data.getHashType
                if (hashType.includes('ADDRESS')) {
                    routeName = 'address'
                } else if (hashType.includes('TX')) {
                    routeName = 'transaction'
                } else if (hashType.includes('TOKEN')) {
                    routeName = 'token-detail'
                } else if (hashType.includes('UNCLE')) {
                    routeName = 'uncle'
                } else if (hashType.includes('BLOCK')) {
                    routeName = 'block'
                } else {
                    this.snackbar = true
                }
                this.$router.push({ name: routeName, params: this.getParam(routeName) })
                this.searchInput = ''
            })
            .catch(err => {
                this.snackbar = true
            })
    }

    getParam(value): {} {
        if (value === 'transaction') {
            return { txRef: this.searchInput }
        } else if (value === 'token-detail' || value === 'address') {
            return { addressRef: this.searchInput }
        } else if (value === 'uncle') {
            return { uncleRef: this.searchInput }
        }
        return { blockRef: this.searchInput }
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get items(): any[] {
        return []
    }

    get selectItems(): any[] {
        return [
            { text: this.$t('filter.all'), value: 'all' },
            { text: this.$t('kb.terms.block.term'), value: 'block' },
            { text: this.$tc('tx.name-short', 1), value: 'transaction' },
            { text: this.$tc('address.name', 1), value: 'address' },
            { text: this.$tc('token.name', 1), value: 'token-detail' },
            { text: this.$tc('uncle.name', 1), value: 'uncle' }
        ]
    }

    get getIcon(): string {
        return this.isValid ? 'fa fa-search grey--text text--lighten-1 pr-4 pl-4' : 'fa fa-search error--text pr-4 pl-4'
    }
}
</script>
<style lang="scss">
.app-search {
    .search-input-container {
        height: 48px;
        .v-select {
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
