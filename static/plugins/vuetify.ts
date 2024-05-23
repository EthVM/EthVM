import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { md, aliases } from 'vuetify/iconsets/md'

aliases.clear = 'close'
const COLORS = {
    navy: '#091E41',
    blue: '#0747A6',
    brightBlue: '#0065FF',
    lightBlue: '#BED3F6',
    orange: '#FF991F',
    red: '#FF5630',
    green: '#4EC7B9',
    purple: '#6554C0',
    teal: '#00B8D9',
    surfaceLM: '#FAFBFD',
    surfaceDM: '#121212',
    greyBackdroundDM: '#2E2E2E',
    greyBackgroundLM: '#C2C7CE',
    darkGreyLM: '#656565',
    darkGreyDM: '#90959C',
    mediumGreyLM: '#DEDBDD',
    lightGreyLM: '#F2F3F6',
    white: '#FAFBFD'
}
const mainnetLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: COLORS.navy,
        secondary: COLORS.brightBlue,
        warning: COLORS.orange,
        error: COLORS.red,
        success: COLORS.green,
        purple: COLORS.purple,
        teal: COLORS.teal,
        textPrimary: COLORS.navy,
        info: COLORS.darkGreyLM,
        loading: COLORS.mediumGreyLM,
        surface: COLORS.surfaceLM,
        background: COLORS.greyBackgroundLM,
        white: COLORS.white,
        whiteLogo: COLORS.white,
        'on-background': COLORS.navy,
        'on-surface': COLORS.navy,
        'on-primary': COLORS.white,
        'on-success': COLORS.surfaceLM,
        'on-surface-tabs': COLORS.navy,
        lightGrey: COLORS.lightGreyLM,
        tabActive: COLORS.blue,
        snackbar: COLORS.navy,
        darkSurface: COLORS.greyBackdroundDM,
        switchTrack: COLORS.darkGreyDM,
        switchThumb: COLORS.lightBlue,
        codeBG: COLORS.navy
    },
    variables: {
        'skeleton-gradient': 0.3
    }
}

const mainnetDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: COLORS.navy,
        secondary: COLORS.brightBlue,
        warning: COLORS.orange,
        error: COLORS.red,
        success: COLORS.green,
        purple: COLORS.purple,
        teal: COLORS.teal,
        textPrimary: COLORS.lightBlue,
        info: COLORS.darkGreyDM,
        loading: COLORS.greyBackdroundDM,
        surface: COLORS.surfaceDM,
        background: COLORS.greyBackdroundDM,
        white: COLORS.lightBlue,
        'on-background': COLORS.lightBlue,
        'on-surface': COLORS.lightBlue,
        'on-primary': COLORS.lightBlue,
        'on-secondary': COLORS.lightBlue,
        'on-success': COLORS.surfaceDM,
        'on-surface-tabs': COLORS.lightBlue,
        lightGrey: COLORS.greyBackdroundDM,
        whiteLogo: COLORS.white,
        tabActive: COLORS.blue,
        snackbar: COLORS.lightBlue,
        darkSurface: COLORS.greyBackgroundLM,
        switchTrack: COLORS.darkGreyDM,
        switchThumb: COLORS.lightBlue,
        codeBG: COLORS.navy
    },
    variables: {
        'skeleton-gradient': 0.03
    }
}

export const themes = {
    light: 'mainnetLightTheme',
    dark: 'mainnetDarkTheme'
}

export default defineNuxtPlugin(app => {
    const vuetify = createVuetify({
        ssr: true,
        icons: {
            defaultSet: 'md',
            aliases,
            sets: {
                md
            }
        },
        theme: {
            defaultTheme: themes.light,
            themes: {
                mainnetLightTheme,
                mainnetDarkTheme
            }
        },
        display: {
            mobileBreakpoint: 'sm',
            thresholds: {
                xs: 0,
                sm: 600,
                md: 905,
                lg: 1240,
                xl: 1439
            }
        }
    })
    app.vueApp.use(vuetify)
})
