<template>
    <div>
        <div v-if="!props.isEditMode">
            <v-tooltip text="You can only store 10 addresses in your portfolio" :disabled="!isDisabled">
                <template v-slot:activator="{ props }">
                    <div v-bind="props" class="d-inline-block">
                        <app-btn-icon v-if="addressPropIsValid" :icon="icon" @click="starClick" :disabled="isDisabled"></app-btn-icon>
                        <app-btn
                            v-else-if="!addressPropIsValid && !smAndDown"
                            text="Add Address"
                            @click="state.openDialog = true"
                            :disabled="isDisabled"
                            icon="add"
                        ></app-btn>
                        <v-btn v-else icon flat color="secondary" height="34px" width="34px" @click="state.openDialog = true" :disabled="isDisabled">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-tooltip>
        </div>
        <app-dialog v-model="state.openDialog" :title="title" height="256" width="480" @update:model-value="closeModule">
            <template #scroll-content>
                <v-row no-gutters align-center justify="center">
                    <v-col cols="12" v-if="props.isEditMode">
                        <div class="d-flex align-center justify-start mb-5">
                            <app-address-blockie v-if="isValidAddress" :address="hashNoSpaces" :size="6" key="identicon" class="mr-3" />
                            <app-transform-hash :hash="eth.toCheckSum(hashNoSpaces)" is-short :show-name="false" />
                        </div>
                    </v-col>
                    <v-col cols="12" v-else>
                        <app-input
                            v-model="state.adrInput"
                            :has-error="hasAddressError"
                            place-holder="Enter Address Hash"
                            show-error-message
                            class="mb-1"
                            :error-message="addressErrorMes"
                            @on-user-input="setAddress"
                        >
                            <template #prepend>
                                <div class="empty-identicon">
                                    <transition name="fade" mode="out-in">
                                        <app-address-blockie v-if="isValidAddress" :address="hashNoSpaces" :size="6" key="identicon" />
                                    </transition>
                                </div>
                            </template>
                        </app-input>
                    </v-col>

                    <v-col cols="12">
                        <app-input
                            v-model="state.nameInput"
                            :has-error="hasNameError"
                            show-error-message
                            error-message="This name is already saved"
                            place-holder="Enter Name"
                            :has-preppend-inner="false"
                            :is-required="isRequiredName"
                            class="mb-1"
                            @on-user-input="setName"
                        ></app-input>
                    </v-col>
                    <app-btn :text="buttonText" @click="addAddressToPortfolio" :disabled="!isValidInput"></app-btn>
                </v-row>
            </template>
        </app-dialog>
    </div>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@/core/components/AppBtnIcon.vue'
import AppDialog from '@core/components/AppDialog.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppInput from '@core/components/AppInput.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import { computed, reactive, watch } from 'vue'
import { useStore } from '@/store'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { eth } from '@core/helper/eth'
import { MAX_PORTFOLIO_ITEMS } from '@/store/helpers'
const store = useStore()
const { xs, smAndDown } = useDisplay()

interface PropType {
    address?: string
    isEditMode?: boolean
    name?: string
}

const props = withDefaults(defineProps<PropType>(), {
    isEditMode: false,
    name: ''
})

interface ComponentState {
    openDialog: boolean
    adrInput: string
    nameInput: string
}

const state: ComponentState = reactive({
    openDialog: props.isEditMode,
    adrInput: props.address ? props.address : '',
    nameInput: props.name
})

/** -------------------
 * Core Button Handler
 ---------------------*/

/**
 * Checks if address in prop is valid hash
 * @param _value user input
 */
const addressPropIsValid = computed<boolean>(() => {
    return eth.isValidAddress(eth.toCheckSum(props.address || ''))
})

/**
 * Checks if address in prop is already added
 * used to determin icon type
 * @param _value user input
 */
const addressPropIsAdded = computed<boolean>(() => {
    return store.addressHashIsSaved(props.address || '') === true
})

/**
 * Adds or removes address from the portfolio list
 */
const starClick = (): void => {
    if (props.address !== undefined && addressPropIsValid.value) {
        if (addressPropIsAdded.value && !props.isEditMode) {
            store.removeAddress(props.address)
        } else {
            state.adrInput = props.address
            if (!store.getAddressName(props.address)) {
                state.openDialog = true
            } else {
                addAddressToPortfolio()
            }
        }
    }
}

/** -------------------
 * Hash Input Handler
 ---------------------*/
const removeSpaces = (val: string): string => {
    if (val) {
        return val.replace(/ /g, '')
    }
    return ''
}
const hashNoSpaces = computed(() => {
    return removeSpaces(state.adrInput)
})

/**
 * Sets address input with timeout from child
 * @param _value user input
 */
const setAddress = (_value: string) => {
    state.adrInput = _value
}

/**
 * Checks if address input was valid
 * Returns true if input is not emty and string is invalid
 * @param _value user input
 */
const hasAddressError = computed<boolean>(() => {
    return !props.isEditMode && (state.adrInput === '' || !isValidAddress.value || !addressIsNew.value)
})

/**
 * Checks if address is valid
 * @param _value user input
 */
const isValidAddress = computed<boolean>(() => {
    return eth.isValidAddress(eth.toCheckSum(hashNoSpaces.value))
})

/**
 * Checks if address is new
 * @param _value user input
 */
const addressIsNew = computed<boolean>(() => {
    return !store.addressHashIsSaved(state.adrInput)
})

/**
 * Returns error message based on the valid criteria
 * @param _value user input
 */
const addressErrorMes = computed<string>(() => {
    return !addressIsNew.value ? 'This address is already saved' : 'This address hash is not valid'
})

/** -------------------
 *  Name Input Handler
 ---------------------*/

/**
 * Sets address input with timeout from child
 * @param _value user input
 */
const setName = (_value: string) => {
    state.nameInput = _value
}

/**
 * Checks if name input was valid
 * Returns true if input is not emty and string is invalid
 * @param _value user input
 */
const hasNameError = computed<boolean>(() => {
    return !isValidName.value
})

/**
 * Checks if name is new
 * @param _value user input
 */
const isValidName = computed<boolean>(() => {
    if (state.nameInput === props.name) {
        return true
    }
    return !store.addressNameIsSaved(state.nameInput)
})

watch(
    () => props.name,
    newVal => {
        state.nameInput = newVal
    }
)

const isRequiredName = computed<boolean>(() => {
    if (props.isEditMode) {
        return store.addressHashIsSaved(state.adrInput)
    }
    return true
})

/** -------------------
 * Add/Edit New Address
 ---------------------*/
const isValidInput = computed<boolean>(() => {
    if (props.isEditMode) {
        return store.addressHashIsSaved(state.adrInput) ? state.nameInput !== '' && !hasNameError.value : !hasNameError.value
    }
    return state.nameInput !== '' && state.adrInput !== '' && !hasAddressError.value && !hasNameError.value
})

const addAddressToPortfolio = (): void => {
    if (props.isEditMode) {
        const isSaved = store.addressHashIsSaved(state.adrInput) || store.addressHashIsSaved(state.adrInput, true)
        if (isSaved) {
            const isAddressBook = store.addressHashIsSaved(state.adrInput, true)
            if (state.nameInput !== '') {
                store.changeAddressName(state.adrInput, state.nameInput, isAddressBook)
            } else if (isAddressBook) {
                store.removeAddress(state.adrInput, true)
            }
        } else {
            store.addAddress(hashNoSpaces.value, state.nameInput, true)
        }
    } else {
        store.addAddress(hashNoSpaces.value, state.nameInput)
    }
    if (!props.address) {
        state.adrInput = ''
        state.nameInput = ''
    }
    state.openDialog = false
    closeModule()
}

/** -------------------
 * Mode Handler (Add/Edit)
 ---------------------*/
const icon = computed<string>(() => {
    if (props.isEditMode) {
        return ''
    }
    return store.addressHashIsSaved(props.address || '') === true ? 'star' : 'star_outline'
})
const title = computed<string>(() => {
    return props.isEditMode ? 'Edit name' : 'Add Address'
})

const buttonText = computed<string>(() => {
    return props.isEditMode ? 'Save' : 'Add'
})

const isDisabled = computed<boolean>(() => {
    if (addressPropIsValid.value && store.addressHashIsSaved(props.address || '')) {
        return false
    }
    return store.portfolioLength === MAX_PORTFOLIO_ITEMS
})

const emit = defineEmits(['close-module'])
const closeModule = () => {
    emit('close-module')
}
</script>

<style scoped lang="scss">
.empty-identicon {
    height: 24px;
    width: 24px;
    background-color: rgb(var(--v-theme-loading));
    border-radius: 50%;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
