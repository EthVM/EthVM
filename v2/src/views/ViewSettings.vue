<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <v-row align="start" justify="start" no-gutters class="ma-0">
                    <p class="font-weight-bold text-h5">General Settings</p>
                    <v-col cols="12" class="d-flex align-center justify-space-between mt-5">
                        <p>{{ themeSwitchLabel }}</p>
                        <v-spacer />
                        <v-switch
                            @update:modelValue="toggleTheme"
                            v-model="isDarkMode"
                            hide-details
                            density="compact"
                            :color="switchColor"
                            class="theme-toggle"
                        ></v-switch>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted, computed, watch, ref } from 'vue'
import { useStore } from '@/store'
import { useTheme } from 'vuetify'
import { themes } from '@core/plugins/vuetify'

const store = useStore()

/**------------------------
 * Theme Switch
 -------------------------*/
const theme = useTheme()
const isDarkMode = ref(false)

const tracking = ref(true)

const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? themes.light : themes.dark
    store.setDarkMode(theme.global.name.value)
}

const themeSwitchLabel = computed<string>(() => {
    return isDarkMode.value ? 'Dark Mode On' : 'Dark Mode Off'
})

watch(
    () => store.appTheme,
    (val: string) => {
        theme.global.name.value = val
        isDarkMode.value = theme.global.name.value === themes.dark
    }
)
const { columnPadding, rowMargin } = useAppViewGrid()

const switchColor = computed<string>(() => {
    return isDarkMode.value ? 'secondary' : 'secondary'
})

onMounted(() => {
    window.scrollTo(0, 0)
    isDarkMode.value = theme.global.name.value === themes.dark
})
</script>

<style lang="scss" scoped>
.theme-toggle {
    :deep(.v-input__control) {
        justify-self: flex-end;
    }

    :deep(.v-label) {
        opacity: 1;
    }
}
</style>
