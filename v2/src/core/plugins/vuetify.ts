// Styles
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/styles/main.scss'
import { md, aliases } from 'vuetify/iconsets/md'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify, ThemeDefinition } from 'vuetify'
type ThemeDefinition = typeof ThemeDefinition

const COLORS = {
    navy: '#091E41',
    blue: '#0747A6',
    brightBlue: '#0065FF',
    lightBlue: '#BED3F6',
    orange: '#FFAB00',
    red: '#FF5630',
    green: '#4EC7B9',
    purple: '#6554C0',
    teal: '#00B8D9',
    surfaceLM: '#FAFBFD',
    white: 'FFFFFF',
    lightGreyLM: '#7C8696',
    lightGreyDM: '#90959C',
    greyBackdroundDM: '#2E2E2E',
    surfaceDM: '#121212',
    greyBackgroundLM: '#C2C7CE',
    greyLoading: '#dedbdd',
    greyLight: '#F4F6FD',
    greyTableBGLight: '#F3F5F9'
}
const mainnetLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: COLORS.blue,
        secondary: COLORS.brightBlue,
        warning: COLORS.orange,
        error: COLORS.red,
        success: COLORS.green,
        purple: COLORS.purple,
        teal: COLORS.teal,
        textPrimary: COLORS.navy,
        info: COLORS.lightGreyLM,
        loading: COLORS.greyLoading,
        surface: COLORS.surfaceLM,
        background: COLORS.greyBackgroundLM,
        white: COLORS.white,
        'on-background': COLORS.navy,
        'on-surface': COLORS.navy,
        'on-primary': COLORS.white,
        'on-success': COLORS.surfaceLM,
        'on-surface-tabs': COLORS.blue,
        pillGrey: COLORS.greyLight,
        tableGrey: COLORS.greyTableBGLight
    },
    variables: {
        'skeleton-gradient': 0.3
    }
}

const mainnetDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: COLORS.blue,
        secondary: COLORS.brightBlue,
        warning: COLORS.orange,
        error: COLORS.red,
        success: COLORS.green,
        purple: COLORS.purple,
        teal: COLORS.teal,
        textPrimary: COLORS.lightBlue,
        info: COLORS.lightGreyDM,
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
        pillGrey: COLORS.greyBackdroundDM,
        tableGrey: COLORS.greyBackdroundDM
    },
    variables: {
        'skeleton-gradient': 0.03
    }
}

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md
        }
    },
    theme: {
        defaultTheme: 'mainnetLightTheme',
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
