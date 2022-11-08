<template>
    <div>
        <div v-if="!props.isEditMode">
            <app-btn-icon v-if="addressPropIsValid" :icon="icon" @click="starClick"></app-btn-icon>
            <app-btn v-else text="Add Address" @click="state.openDialog = true"></app-btn>
        </div>
        <app-dialog v-model="state.openDialog" :title="title" height="256" width="480" @update:model-value="closeModule">
            <template #scroll-content>
                <div class="d-flex justify-center align-center flex-column">
                    <div v-if="props.isEditMode" class="d-flex align-center justify-start mb-5">
                        <app-address-blockie v-if="isValidAddress" :address="hashNoSpaces" :size="6" key="identicon" class="mr-3" />
                        <app-transform-hash :hash="eth.toCheckSum(hashNoSpaces)" />
                    </div>
                    <app-input
                        v-if="!props.isEditMode"
                        v-model="state.adrInput"
                        :has-error="hasAddressError"
                        place-holder="Enter Address Hash"
                        show-error-message
                        width="100%"
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
                    <app-input
                        v-model="state.nameInput"
                        :has-error="hasNameError"
                        show-error-message
                        error-message="This name is already saved"
                        place-holder="Enter Name"
                        :has-preppend-inner="false"
                        width="100%"
                        class="mb-1"
                        @on-user-input="setName"
                    ></app-input>
                    <app-btn :text="buttonText" @click="addAddressToPortfolio" :disabled="!isValidInput"></app-btn>
                </div>
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
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { eth } from '@core/helper/eth'

const store = useStore()

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
            state.openDialog = true
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
    return !props.isEditMode && state.adrInput !== '' && (!isValidAddress.value || !addressIsNew.value)
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
    return state.nameInput !== '' && !isValidName.value
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

/** -------------------
 * Add/Edit New Address
 ---------------------*/
const isValidInput = computed<boolean>(() => {
    if (props.isEditMode) {
        return !hasNameError.value
    }
    return state.nameInput !== '' && state.adrInput !== '' && !hasAddressError.value && !hasNameError.value
})

const addAddressToPortfolio = (): void => {
    if (props.isEditMode) {
        store.changeAddressName(state.adrInput, state.nameInput)
    } else {
        store.addAddress(hashNoSpaces.value, state.nameInput)
        state.adrInput = ''
        state.nameInput = ''
    }
    state.openDialog = false
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
