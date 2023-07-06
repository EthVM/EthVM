<template>
    <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
        <v-row align="start" justify="start" no-gutters class="ma-0">
            <p class="font-weight-bold text-h5">{{ $t('settings.header.general') }}</p>
            <v-col cols="12" class="d-flex align-center justify-space-between mt-5">
                <p>{{ themeSwitchLabel }}</p>
                <v-spacer />
                <v-switch
                    @update:modelValue="toggleTheme"
                    v-model="isDarkMode"
                    hide-details
                    density="compact"
                    color="secondary"
                    class="theme-toggle"
                ></v-switch>
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-space-between mt-5">
                <p>{{ dataSwitchLabel }}</p>
                <p>{{ $t('settings.darkModeOn') }}</p>
                <v-spacer />
                <v-switch
                    @update:modelValue="toggleData"
                    v-model="dataShareOn"
                    hide-details
                    density="compact"
                    color="secondary"
                    class="theme-toggle"
                ></v-switch>
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-space-between mt-5">
                <p>{{ $t('settings.language') }}</p>
                <v-spacer />
                <v-btn id="activator-lang-menu" variant="text" class="font-weight-regular mr-n1" rounded="pill" size="small">{{
                    getTitle($i18n.locale)
                }}</v-btn>

                <app-menu min-width="170" activator="#activator-lang-menu">
                    <v-list-item v-for="locale in $i18n.availableLocales" :key="locale" :title="getTitle(locale)" class="py-2" @click="toggleLang(locale)">
                        <template #append>
                            <p class="font-weight-bold">{{ getId(locale) }}</p>
                        </template>
                    </v-list-item>
                </app-menu>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue'
import { useStore } from '@/store'
import { useTheme } from 'vuetify'
import { themes } from '@core/plugins/vuetify'
import { useI18n } from 'vue-i18n'
import { LANGUAGE } from '@/store/helpers'
import AppMenu from '@/core/components/AppMenu.vue'
const { t, locale } = useI18n()

const store = useStore()

/**------------------------
 * Theme Switch
 -------------------------*/
const theme = useTheme()
const isDarkMode = ref(false)

const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? themes.light : themes.dark
    store.setDarkMode(theme.global.name.value)
}

const themeSwitchLabel = computed<string>(() => {
    return isDarkMode.value ? t('settings.darkModeOn') : t('settings.darkModeOff')
})

watch(
    () => store.appTheme,
    (val: string) => {
        theme.global.name.value = val
        isDarkMode.value = theme.global.name.value === themes.dark
    }
)

/**------------------------
 * Data Sharing Switch
 -------------------------*/
const dataShareOn = ref(true)
const dataSwitchLabel = computed<string>(() => {
    return dataShareOn.value ? t('settings.data-share.on') : t('settings.data-share.off')
})

const toggleData = () => {
    dataShareOn.value = !dataShareOn.value
    store.setDataShare(dataShareOn.value)
}

watch(
    () => store.dataShare,
    (val: boolean) => {
        if (val !== dataShareOn.value) {
            dataShareOn.value = val
        }
    }
)

onMounted(() => {
    isDarkMode.value = theme.global.name.value === themes.dark
    dataShareOn.value = store.dataShare
})

/**------------------------
 * Language Switch
 -------------------------*/

const getTitle = (locale: string): string => {
    return LANGUAGE[locale]?.title || 'English'
}

const getId = (locale: string): string => {
    return LANGUAGE[locale]?.id || 'EN'
}
const toggleLang = (lang: string) => {
    locale.value = lang
}
</script>

<style lang="scss" scoped>
.theme-toggle {
    :deep(.v-input__control) {
        justify-self: flex-end;
    }

    :deep(.v-label) {
        opacity: 1;
    }
    :deep(.v-switch__track) {
        color: rgb(var(--v-theme-switchTrack)) !important;
        opacity: 1;
    }
    :deep(.v-switch__thumb) {
        color: rgb(var(--v-theme-switchThumb));
    }
}
</style>
