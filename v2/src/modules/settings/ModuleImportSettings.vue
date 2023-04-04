<template>
    <app-dialog v-model="state.openDialog" :title="title" height="400" width="480" @update:model-value="updateDialogState">
        <template v-if="state.openDialog" #no-scroll-content>
            <div class="d-flex flex-column align-center">
                <app-upload-file :error="fileError" @fileUpdate="setFile" class="mt-4 mb-5" />
                <app-btn text="Import" :disabled="disableImport" @click="importSettings" key="btn-import" min-width="160" :loading="loading"></app-btn>
            </div>
        </template>
    </app-dialog>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import AppDialog from '@core/components/AppDialog.vue'
import { computed, reactive, watch, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { IMPORT_TYPE, EXPORT_KEYS } from './helpers/index'
import AppUploadFile from '@/core/components/AppUploadFile.vue'
import { isPortfolioItem, PortfolioItem } from '@/store/helpers'

const store = useStore()
interface PropType {
    type?: IMPORT_TYPE
    modelValue?: boolean
}

const props = withDefaults(defineProps<PropType>(), {
    type: IMPORT_TYPE.NAMES,
    modelValue: false
})

interface ComponentState {
    openDialog: boolean
}

const state: ComponentState = reactive({
    openDialog: props.modelValue
})

const emit = defineEmits<{
    (e: 'update:modelValue', dialog: boolean): void
}>()

/**------------------------
 * Open/close Dialog
 -------------------------*/

/**
 * Watching changes from the parent
 */
watch(
    () => props.modelValue,
    newVal => {
        if (newVal !== state.openDialog) {
            state.openDialog = newVal
        }
    }
)

const title = computed<string>(() => {
    return props.type === IMPORT_TYPE.NAMES ? 'Import Names' : props.type === IMPORT_TYPE.PORTFOLIO ? 'Import Portfolio' : 'Import All Settings'
})

/**------------------------
 * File Check
 -------------------------*/

const fileData: Ref<string | ArrayBuffer | Blob | undefined> = ref(undefined)

const setFile = (_fileData: string | ArrayBuffer | Blob | undefined) => {
    fileData.value = _fileData
}

const fileError = computed<string | undefined>(() => {
    if (fileData.value?.toString()) {
        const data = JSON.parse(fileData.value?.toString())
        if (typeof data === 'object' && data !== null) {
            const keys = Object.keys(data)
            if (keysAreValid(keys)) {
                if (Array.isArray(data[EXPORT_KEYS.PORTFOLIO]) && Array.isArray(data[EXPORT_KEYS.NAMES])) {
                    const validPortfolio = data[EXPORT_KEYS.PORTFOLIO].every(it => isPortfolioItem(it))
                    const validNames = data[EXPORT_KEYS.NAMES].every(it => isPortfolioItem(it))
                    if (validNames && validPortfolio) {
                        return ''
                    }
                }
            }
        }
    }
    return 'File contents are not valid'
})

const keysAreValid = (keys: string[]): boolean => {
    if (props.type === IMPORT_TYPE.NAMES && keys.length === 2) {
        if (keys.includes(EXPORT_KEYS.PORTFOLIO) && keys.includes(EXPORT_KEYS.NAMES)) {
            return true
        }
    }
    return false
}
/**------------------------
 * Import
 -------------------------*/
const loading = ref(false)
const disableImport = computed<boolean>(() => {
    return !(fileData.value && fileError.value === '')
})

const importSettings = async () => {
    loading.value = true
    if (fileData.value?.toString()) {
        const data = JSON.parse(fileData.value?.toString())
        // store.importAdrs(data[EXPORT_KEYS.PORTFOLIO], data[EXPORT_KEYS.NAMES])
        const newP = data[EXPORT_KEYS.PORTFOLIO] as PortfolioItem[]
        const newA = data[EXPORT_KEYS.NAMES] as PortfolioItem[]
        await newP.forEach(i => {
            if (store.portfolioLength <= 10 && !store.addressHashIsSaved(i.hash)) {
                store.addAddress(i.hash, i.name, false, false)
            } else if (!store.addressHashIsSaved(i.hash) && !store.addressHashIsSaved(i.hash, true)) {
                store.addAddress(i.hash, i.name, true)
            }
        })
        await newA.forEach(i => {
            if (!store.addressHashIsSaved(i.hash) && !store.addressHashIsSaved(i.hash, true)) {
                store.addAddress(i.hash, i.name, true)
            }
        })
    }
    updateDialogState(false)
}

/**
 * Fires on changes in AppDialog, updated current state and emits to parent
 */
const updateDialogState = (_value: boolean) => {
    state.openDialog = _value
    emit('update:modelValue', _value)
    if (!state.openDialog) {
        setFile(undefined)
        loading.value = false
    }
}
</script>

<style scoped lang="scss">
.drop-file-area {
    :deep(.v-input__control) {
        height: 154px;
        width: 100%;
    }
    :deep(.v-input__prepend) {
        display: none;
    }
}
</style>
