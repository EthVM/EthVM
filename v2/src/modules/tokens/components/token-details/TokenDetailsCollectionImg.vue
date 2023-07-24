<template>
    <v-img cover :src="imagePreview" @error="imgLoadFail" :height="194" :width="194" :max-width="216" class="rounded-lg align-end img-shadow">
        <div v-if="imagePreview === require('@/assets/icon-nft.png')" class="no-image text-uppercase text-caption text-center py-2 justify-end">
            {{ $t('message.imageNotAvailable') }}
        </div>
    </v-img>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface PropType {
    imgLink?: string
}

const props = defineProps<PropType>()

interface ComponentState {
    imageExists: boolean
}

const state: ComponentState = {
    imageExists: true
}

/**
 * Image loading failed catcher
 */
const imgLoadFail = (): void => {
    state.imageExists = false
}

/*
===================================================================================
  Computed Values
===================================================================================
*/

const imagePreview = computed<string>(() => {
    if (props.imgLink && state.imageExists) {
        return props.imgLink
    }
    return require('@/assets/icon-nft.png')
})
</script>
<style scoped lang="scss">
.img-shadow {
    box-shadow: 0px 8px 20px rgba(174, 182, 202, 0.5);
}

.no-image {
    background-color: rgb(var(--v-theme-primary));
    color: rgba(255, 255, 255, 0.5);
    min-height: 36px;
    width: 100%;
}
</style>
