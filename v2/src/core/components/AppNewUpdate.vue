<template>
    <v-btn v-if="display" :class="['new-block-alert', 'text-capitalize', 'ma-0', sm || xs ? 'caption' : '']" flat @click="onReload">
        {{ buttonText }}
        <v-icon class="ml-2 secondary--text fas fa-sync small-global-icon-font">sync</v-icon>
    </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { sm, xs } = useDisplay()

/*
===================================================================================
  PROPS:
===================================================================================
*/

const props = defineProps({
    text: {
        type: String,
        default: ''
    },
    updateCount: {
        type: Number,
        default: 0
    },
    hideCount: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['reload'])

/*
===================================================================================
  COMPUTED:
===================================================================================
*/
const display = computed<boolean>(() => {
    return props.updateCount > 0
})

const buttonText = computed<string>(() => {
    return props.hideCount ? `${props.text}` : `${props.updateCount} ${props.text}`
})

/*
===================================================================================
  METHODS:
===================================================================================
*/

/**
 * Emits reload to parent
 */
const onReload = (): void => {
    emit('reload')
}
</script>

<style scoped lang="css">
.new-block-alert {
    height: 44px;
    border: solid 1px #ffb647;
    background-color: rgba(254, 217, 161, 0.25) !important;
}
</style>
