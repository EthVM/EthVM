<template>
    <v-row align-content="end" justify="end" no-gutters>
        <v-col cols="4" lg="3">
            <v-select v-model="selected" :items="props.selectItems" @update:modelValue="onSearch" variant="outlined" />
        </v-col>
        <v-col>
            <v-text-field
                id="search-options-activator"
                v-model="search.value"
                label="Search Address, Tx, Block"
                clearable
                dense
                :color="props.hasError ? 'red' : 'black'"
                variant="outlined"
                :error-messages="errorMes"
                :loading="props.isLoading"
                @click:clear="resetValues"
                @update:modelValue="onSearch"
                @focus="search.focus = true"
                @blur="search.focus = false"
                @keyup.enter="onSearch"
            ></v-text-field>
            <!-- TEMP COMPONENET: replace with combobox  -->
            <v-menu location="bottom" activator="#search-options-activator">
                <v-card v-if="searchOptions.length > 0" min-width="400" max-height="300px">
                    <v-list>
                        <v-list-subheader>Tokens</v-list-subheader>
                        <v-list-item
                            v-for="item in searchOptions"
                            :key="item.contract"
                            prepend-icon="image"
                            :title="item.text"
                            :subtitle="item.contract"
                            class="overflow-hidden"
                            @click="onSelectToken(item.contract)"
                        >
                            <!-- <template v-slot:append>
                                <v-list-item-subtitle end> $12.99 </v-list-item-subtitle>
                            </template> -->
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { defineProps, defineEmits, reactive, computed, ref } from 'vue'
import { SearchTokenOption } from './props/index'
const props = defineProps({
    selectItems: {
        type: Array as PropType<string[]>,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: true
    },
    hasError: {
        type: Boolean
    },
    searchOptions: {
        type: Array as PropType<SearchTokenOption[]>,
        default: () => []
    }
})

const emit = defineEmits<{
    (e: 'onSearch', searchValue: string, filterValue: string | undefined): void
    (e: 'tokenSelected', contract: string): void
}>()

const selected = ref(props.selectItems[0])

/*
  ===================================================================================
    Search
  ===================================================================================
  */
interface Search {
    focus: boolean
    timeout: number
    value: string
    optionsTimeout: number
}

const search: Search = reactive({ focus: false, timeout: 0, value: '', optionsTimeout: 0 })
/**
 * Emits user input to parent with the timeout of 600
 */
const onSearch = (): void => {
    clearTimeout(search.timeout)
    search.timeout = window.setTimeout(() => {
        emit('onSearch', search.value, selected.value)
    }, 600)
}
/**
 * Emits selected token contract from the parent provided options
 * @param {string} contract - token contract to emit
 */
const onSelectToken = (contract: string): void => {
    emit('tokenSelected', contract)
}

/**
 * Resets search
 */
const resetValues = (): void => {
    clearTimeout(search.timeout)
    emit('onSearch', search.value, selected.value)
}

/* TEMP SOLUTIONS: SINCE VUETIFY ERROR STATE IS BROKEN */
const errorMes = computed<string>(() => {
    return props.hasError ? 'ERROR: INVALID SEARCH' : ''
})
</script>
<style lang="scss">
.search-options {
    position: fixed;
    position: absolute;
    top: 100px;
    background-color: green;
    z-index: 1000;
}
</style>
