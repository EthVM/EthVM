<template>
    <v-row align="center" justify="end" class="my-0">
        <v-card class="rounded-s-pill rounded-e-0" width="380" id="search-options-activator">
            <v-text-field
                v-model="search.value"
                color="secondary"
                density="compact"
                variant="solo"
                placeholder="Search by address/transaction/token"
                hide-details
                clearable
                height="32px"
                class="text-caption"
                @click:clear="resetValues"
                @update:modelValue="onSearch"
                @focus="search.focus = true"
                @blur="search.focus = false"
                @keyup.enter="onSearch"
            >
                <template v-slot:prepend-inner>
                    <v-icon :color="search.value ? (props.hasError ? 'error' : 'secondary') : 'info'" icon="search" />
                </template>
            </v-text-field>
        </v-card>

        <!-- <v-card color="surface" height="40px" width="380px" class="rounded-s-pill rounded-e-0"> -->
        <!-- <v-text-field
            id="search-options-activator"
            v-model="search.value"
            placeholder="Search by address, tx, token"
            clearable
            :color="props.hasError ? 'red' : 'black'"
            :error-messages="errorMes"
            :loading="props.isLoading"
            density="compact"
            variant="solo"
            single-line
            hide-details
            @click:clear="resetValues"
            @update:modelValue="onSearch"
            @focus="search.focus = true"
            @blur="search.focus = false"
            @keyup.enter="onSearch"
        ></v-text-field> -->
        <!-- </v-card> -->
        <!-- <v-col cols="3" class="px-0">
                <v-btn variant="text" class="text-caption font-weight-light text-right" rounded="0" height="32px">
                    {{ selected }}
                    <v-icon class="ml-2">expand_more</v-icon>

                    <app-menu min-width="180" activator="parent" :items="props.selectItems">
                        <template v-for="link in props.selectItems" :key="link">
                            <v-list-item :value="link" :title="link" class="primary--text" @click="onSearch(link)"> </v-list-item>
                        </template>
                    </app-menu>
                </v-btn>
            </v-col> -->
        <v-btn variant="flat" color="secondary" height="40" width="130px" class="rounded-e-pill rounded-s-0 px-0">
            Search
            <!-- <v-icon>search</v-icon> -->
        </v-btn>
        <v-menu location="bottom" activator="#search-options-activator">
            <v-card width="380" max-height="300px" rounded="xl" class="mt-1">
                <app-no-result v-if="props.hasError" :text="`We could not find anything mathching: ${search.value}`"></app-no-result>
                <slot v-else name="search-results"> </slot>
                <v-progress-linear v-if="isLoading" class="position-absolute" style="z-index: 1" color="secondary" height="5" indeterminate></v-progress-linear
            ></v-card>
            <!-- <v-card  min-width="380" max-height="300px">
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
                        <template v-slot:append>
                            <v-list-item-subtitle end> $12.99 </v-list-item-subtitle>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card> -->
        </v-menu>
    </v-row>
    <!-- <v-row align-content="center" justify="end" no-gutters>
        <v-col cols="4" lg="3">
          <v-select v-model="selected" :items="props.selectItems" @update:modelValue="onSearch" variant="outlined" /> 
        </v-col>
        <v-col> -->

    <!-- <v-text-field
                id="search-options-activator"
                v-model="search.value"
                placeholder="Search Address, Tx, Block"
                clearable
                dense
                :color="props.hasError ? 'red' : 'black'"
                variant="plain"
                :error-messages="errorMes"
                :loading="props.isLoading"
                @click:clear="resetValues"
                @update:modelValue="onSearch"
                @focus="search.focus = true"
                @blur="search.focus = false"
                @keyup.enter="onSearch"
            ></v-text-field> -->
    <!-- TEMP COMPONENET: replace with combobox  -->
    <!-- 
        </v-col> 
    </v-row> -->
</template>

<script setup lang="ts">
import AppNoResult from './AppNoResult.vue'
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
    isActive: boolean
}

const search: Search = reactive({ focus: false, timeout: 0, value: '', optionsTimeout: 0, isActive: true })
/**
 * Emits user input to parent with the timeout of 600
 */
const onSearch = (): void => {
    // if (_selected) {
    //     selected.value = _selected
    // }
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
.v-field.v-field--no-label.v-field--variant-solo {
    box-shadow: none !important;
}
input {
    font-size: 14px !important;
}
.v-field__prepend-inner > .v-icon {
    opacity: 1 !important;
}

.v-field__clearable {
    align-items: center !important;
    font-size: 14px !important;
    padding-top: 0px !important;
}
</style>
