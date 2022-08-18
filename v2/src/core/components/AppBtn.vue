<template>
    <v-hover v-slot="{ isHovering, props }" :disabled="componentProps.disabled">
        <v-btn
            v-bind="props"
            :color="button.color"
            :variant="isSmall && !isHovering ? 'outlined' : 'flat'"
            :size="button.size"
            :rounded="button.rounded"
            :min-width="button.minWidth"
            :disabled="componentProps.disabled"
            min-height="24px"
            @click.stop="btnClick()"
            :class="[isSmall ? 'small-button px-3' : 'large-button px-6', 'text-button']"
        >
            {{ componentProps.text }}
            <v-icon v-if="componentProps.icon" class="ml-2">{{ componentProps.icon }}</v-icon>
        </v-btn>
    </v-hover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const componentProps = defineProps({
    icon: String,
    btnColor: String,
    isSmall: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        default: 'More'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['click'])
interface ButtonState {
    color: string
    size: string
    rounded: string
    minWidth: string
}
const button = computed<ButtonState>(() => {
    return componentProps.isSmall
        ? {
              color: componentProps.btnColor ? componentProps.btnColor : 'textPrimary',
              size: 'x-small',
              rounded: 'pill',
              minWidth: '84'
          }
        : {
              color: componentProps.btnColor ? componentProps.btnColor : 'secondary',
              size: 'default',
              rounded: 'pill',
              minWidth: '172'
          }
})

const btnClick = (): void => {
    emit('click')
}
</script>
<style lang="scss" scoped>
.large-button {
    transition: 0.7s;
    &:hover {
        opacity: 80%;
    }
}
.small-button {
    transition: 0.5s;
    &:hover {
        opacity: 100%;
        border: 1px solid rgba(255, 255, 255, 0);
    }
}
.v-icon {
    font-size: 16px;
}
.large-button,
.small-button {
    :deep(.v-btn__content) {
        line-height: 1;
    }
}
</style>
