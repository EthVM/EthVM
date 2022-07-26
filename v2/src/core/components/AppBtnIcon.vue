<template>
    <v-btn icon variant="plain" :size="props.size" @click.stop="btnClick()" class="button-icon" :ripple="false">
        <v-icon :color="props.color">{{ props.icon }}</v-icon>
        <v-tooltip v-if="tooltipText !== ''" activator="parent" location="top">
            {{ tooltipText }}
        </v-tooltip>
    </v-btn>
</template>

<script setup lang="ts">
const props = defineProps({
    tooltipText: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'question_mark'
    },
    color: {
        type: String,
        default: 'textPrimary'
    },
    size: {
        type: String,
        default: 'x-small'
    }
})

const emit = defineEmits(['click'])

/*
===================================================================================
    Computed
===================================================================================
*/

const btnClick = (): void => {
    emit('click')
}
</script>

<style lang="scss" scoped>
@use '~vuetify/lib/components/VBtn/VBtn.sass';

.button-icon {
    opacity: 100% !important;
    .v-icon {
        font-size: 16px;
        transition: 0.3s;
        &:hover {
            opacity: 70%;
        }
        &:active {
            opacity: 50%;
        }
    }
}
</style>
