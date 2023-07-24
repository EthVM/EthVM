<template>
    <div>
        <div
            :class="[areaClass, 'file-drop-area rounded-xl d-flex flex-column justfy-center align-center fill-height pa-6 mb-3']"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
            @click="openOnClick"
        >
            <p class="px-5 px-sm-10 mb-3 text-center text-info mb-5">
                {{ $t('settings.import.dragAndDrop') }}
            </p>
            <app-btn :text="$t('settings.import.selectFile')" min-width="160" @click="openOnClick"></app-btn>
        </div>

        <div style="min-height: 48px">
            <v-scroll-x-transition>
                <v-row v-if="res.fileName.value" align="center" justify="center" key="file">
                    <v-col cols="6" sm="8">
                        <p class="text-ellipses">{{ res.fileName }}</p>
                    </v-col>
                    <v-col class="d-flex align-center justify-end">
                        <p class="mx-2">{{ res.fileSize }} KB</p>
                        <app-btn-icon icon="close" @click="remove"></app-btn-icon>
                    </v-col>
                </v-row>
            </v-scroll-x-transition>
            <div class="file-error-message">
                <v-scroll-x-transition hide-on-leave>
                    <p v-if="res.fileName.value && props.error" class="text-error" key="error">
                        {{ props.error }}
                    </p>
                </v-scroll-x-transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppBtn from './AppBtn.vue'
import AppBtnIcon from './AppBtnIcon.vue'
import { ref } from 'vue'
import { useFileSystemAccess } from '@vueuse/core'

const VALID_FORMAT = 'application/json'

const res = useFileSystemAccess({
    types: [
        {
            description: 'text',
            accept: {
                'application/json': ['.json']
            }
        }
    ],
    excludeAcceptAllOption: true
})

const props = defineProps({
    error: {
        type: String,
        required: false
    }
})

const emit = defineEmits<{
    (e: 'fileUpdate', file: string | ArrayBuffer | Blob | undefined): void
}>()

/**------------------------
 * File drag and drop
 -------------------------*/

const areaClass = ref('')

/**
 * Event fires on file drag over the area. Ads active background color over the area.
 */
const dragover = async (event: DragEvent) => {
    event.preventDefault()
    areaClass.value = 'file-over-drop'
}
/**
 * Event fires when mouse leaves area. Removes background color
 */
const dragleave = () => {
    // Clean up
    areaClass.value = ''
}
const classTimeout = ref(0)

/**
 * Event fires on file drop. Checks if file is JSON format. sets new file
 * @param event event that cased file transfer
 */
const drop = async (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        const file = await event.dataTransfer.files[0]
        clearTimeout(classTimeout.value)
        if (file) {
            if (file.type === VALID_FORMAT && event.dataTransfer.files.length <= 1) {
                res.file.value = file
                await res.updateData()
                emit('fileUpdate', res.data.value)
                areaClass.value = ''
            } else {
                areaClass.value = 'file-drop-error'
                classTimeout.value = window.setTimeout(() => {
                    areaClass.value = ''
                }, 2500)
            }
        }
    }
}

/**------------------------
 * File open/remove
 -------------------------*/

/**
 * calls open() from composable, sets file and emits to parent on update
 */
const openOnClick = async () => {
    await res.open()
    emit('fileUpdate', res.data.value)
}

/**
 * sets file to undefiend and emits to parent on update
 */
const remove = async () => {
    res.file.value = undefined
    await res.updateData()
    emit('fileUpdate', undefined)
}
</script>

<style scoped lang="css">
.file-drop-area {
    cursor: pointer;
    border: 2px dashed rgb(var(--v-theme-secondary)) !important;
}

.file-over-drop {
    background-color: rgb(var(--v-theme-secondary), 0.05);
}

.file-drop-error {
    background-color: rgb(var(--v-theme-error), 0.05);
}
.file-error-message {
    min-height: 14px;
    font-size: 12px !important;
    line-height: 14px;
}
</style>
