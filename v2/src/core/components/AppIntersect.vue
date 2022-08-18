<template>
    <div
        class="ma-0"
        v-intersect="{
            handler: onIntersect,
            options: {
                threshold: 0.5
            }
        }"
    >
        <slot>
            <div class="intersect"></div>
        </slot>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: 'intersect', isVisible: boolean): void
}>()

const onIntersect = (e: boolean): void => {
    emit('intersect', e)
}
</script>

<style lang="scss" scoped>
.intersect {
    min-height: 100px;
    width: 100%;
}
</style>
