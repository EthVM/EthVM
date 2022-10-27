<template>
    <div>
        <app-btn-icon v-if="addressPropIsValid" :icon="addressPropIsAdded ? 'star' : 'star_outline'" @click="starClick"></app-btn-icon>
        <app-btn v-else text="Add Address" @click="state.openDialog = true"></app-btn>
        <app-dialog v-model="state.openDialog" title="Add Address" height="256" width="480">
            <template #scroll-content>
                <div class="d-flex justify-center align-center flex-column">
                    <app-input
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
                                    <app-address-blockie v-if="isValidAddress" :address="state.adrInput" :size="6" key="identicon" />
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
                    <app-btn text="Add" @click="addAddressToPortfolio" :disabled="!isValidInput"></app-btn>
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
import { computed, reactive } from 'vue'
import { useStore } from '@/store'
import { eth } from '@core/helper/eth'

const store = useStore()

interface PropType {
    address?: string
}
const props = defineProps<PropType>()

interface ComponentState {
    openDialog: boolean
    adrInput: string
    nameInput: string
}

const state: ComponentState = reactive({
    openDialog: false,
    adrInput: '',
    nameInput: ''
})

/** -------------------
 * Star Button Handler
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
        if (addressPropIsAdded.value) {
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
    return state.adrInput !== '' && (!isValidAddress.value || !addressIsNew.value)
})

/**
 * Checks if address is valid
 * @param _value user input
 */
const isValidAddress = computed<boolean>(() => {
    return eth.isValidAddress(eth.toCheckSum(state.adrInput))
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
    console.log('isValid Name', !store.addressNameIsSaved(state.nameInput))
    return !store.addressNameIsSaved(state.nameInput)
})

/** -------------------
 * Add New Address
 ---------------------*/
const isValidInput = computed<boolean>(() => {
    return state.nameInput !== '' && state.adrInput !== '' && !hasAddressError.value && !hasNameError.value
})

const addAddressToPortfolio = (): void => {
    store.addAddress(state.adrInput, state.nameInput)
    state.openDialog = false
    state.adrInput = ''
    state.nameInput = ''
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
