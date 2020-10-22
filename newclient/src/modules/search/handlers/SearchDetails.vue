<template>
    <search
        ref="search"
        :items="items"
        :is-loading="isLoading"
        :select-items="selectItems"
        :has-error="hasError"
        @onSelect="onSelect"
        @getToken="getToken"
        @getAllSearch="getAllSearch"
        @routeTo="routeTo"
    />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getTokensBeginsWith, getHashType } from '@app/modules/search/handlers/searchDetails.graphql'
import Search from '@app/modules/search/components/Search.vue'
import { eth } from '@app/core/helper'
interface SearchRef extends Vue {
    resetValues(): void
}
@Component({
    components: {
        Search
    }
})
export default class SearchDetails extends Vue {
    $refs!: {
        search: SearchRef
    }
    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    hasError = false
    searchAutocomplete = ''
    items = []
    isLoading = false
    /*
  ===================================================================================
    Methods
  ===================================================================================
  */
    /**
     * Sets error and cancels loading
     * @param param {Any}
     */
    setError(param): void {
        this.routeToNotFound(param)
        this.hasError = true
        this.isLoading = false
    }
    /**
     * Checks whether param is valid
     * @param param {Any}
     */
    isValid(param): boolean {
        return eth.isValidHash(this.removeSpaces(param)) || eth.isValidAddress(this.removeSpaces(param))
    }
    /**
     * Gets the hashtype of param
     * @param param {Any}
     */
    getHashType(param): void {
        let routeName = ''
        this.isLoading = true
        this.hasError = false
        if (!this.isValid(param)) {
            this.setError(param)
            return
        }
        this.$apollo
            .query({
                query: getHashType,
                variables: {
                    hash: this.removeSpaces(param)
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
                    routeName = 'blockHash'
                } else {
                    this.setError(param)
                }
                this.routeTo(routeName, param)
                this.isLoading = false
            })
            .catch(error => {
                this.setError(param)
                throw error
            })
    }
    /**
     * Sends user to not found route
     * @param searchVal {Any}
     */
    routeToNotFound(searchVal): void {
        const route = { name: 'search-not-found', params: { searchTerm: searchVal } }
        this.$router.push(route).catch(() => {})
    }
    /**
     * Sends user to the right page
     * @param selectVal {Any}
     * @param searchVal {Any}
     */
    routeTo(selectVal, searchVal): void {
        const route = { name: this.getSelectVal(selectVal, searchVal), params: this.getParam(selectVal, searchVal) }
        this.$router.push(route).catch(() => {})
    }
    /**
     * Route user to tokens ppage
     * @param param {Any}
     */
    routeToToken(param): void {
        const route = { name: 'token-detail', params: { addressRef: this.removeSpaces(param) } }
        this.$router
            .push(route)
            .then(() => this.$refs.search.resetValues())
            .catch(() => {})
    }
    /**
     * Get selected value
     * @param selectVal {Any}
     * @param searchVal {Any}
     */
    getSelectVal(selectVal, searchVal) {
        const isNum = /^\d+$/.test(searchVal)
        if (selectVal === 'block' && !isNum) {
            return 'blockHash'
        }
        return selectVal
    }
    /**
     * Get params
     * @param selectVal {Any}
     * @param searchVal {Any}
     */
    getParam(selectVal, searchVal): {} {
        if (selectVal === 'transaction') {
            return { txRef: this.removeSpaces(searchVal) }
        } else if (selectVal === 'token-detail' || selectVal === 'address') {
            return { addressRef: this.removeSpaces(searchVal) }
        } else if (selectVal === 'uncle') {
            return { uncleRef: this.removeSpaces(searchVal) }
        }
        return { blockRef: this.removeSpaces(searchVal) }
    }
    /**
     * Get tokens
     * @param param {Any}
     */
    getToken(param): void {
        if (!this.onlyLetters(param)) {
            return
        }
        this.isLoading = true
        this.hasError = false
        this.$apollo
            .query({
                query: getTokensBeginsWith,
                variables: {
                    keyword: param.trim()
                }
            })
            .then(response => {
                this.items = response.data.getTokensBeginsWith
                if (this.items.length === 1 && this.items[0]['contract'] && this.items[0]['keyword'] === param.trim().toLowerCase()) {
                    this.routeToToken(this.items[0]['contract'])
                }
                if (this.items.length === 0) {
                    this.setError(param)
                }
                this.isLoading = false
            })
            .catch(error => {
                this.setError(param)
                throw error
            })
    }
    /**
     * Get search values based on if param is token or hashType
     * @param param {Any}
     */
    getAllSearch(param): void {
        if (param && param.contract) {
            this.routeToToken(param.contract)
        }
        this.onlyLetters(param) ? this.getToken(param) : this.getHashType(param)
    }
    /**
     * Get selected value and route user to token page
     * @param param {Any}
     */
    onSelect(param): void {
        if (param && param.contract) {
            this.routeToToken(param.contract)
        }
    }
    /**
     * Removes spaces from val
     * @param val {Any}
     */
    removeSpaces(val): string {
        if (val) {
            return val.replace(/ /g, '')
        }
        return ''
    }
    /**
     * Check if param onl contains string
     * @param param {Any}
     */
    onlyLetters(param): boolean {
        const value = this.removeSpaces(param)
        return /^[a-zA-Z]+$/.test(value) ? true : false
    }
    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
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
}
</script>
