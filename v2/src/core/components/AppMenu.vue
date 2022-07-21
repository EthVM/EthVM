<template>
    <v-menu close-delay="100" max-height="500" open-delay="60" :open-on-hover="true" transition="slide-y-transition" location="bottom">
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }" />
        </template>
        <v-list bg-color="primary" class="my-2">
            <slot v-if="$slots.default" />
        </v-list>
    </v-menu>
</template>

<script setup lang="ts"></script>
