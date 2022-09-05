<template>
    <div>
        <p>
            {{ props.tokenHistory }}
        </p>
    </div>
</template>

<script setup lang="ts">
interface PropType {
    tokenHistory: string
}

const props = defineProps<PropType>()
</script>
