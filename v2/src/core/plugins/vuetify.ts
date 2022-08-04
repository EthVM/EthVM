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
    blueBright: '#0065FF',
    blueLight: '#BED3F6',
    orange: '#FFAB00',
    red: '#FF5630',
    green: '#4EC7B9',
    purple: '#6554C0',
    teal: '#00B8D9',
    offWhite: '#FAFBFD',
    white: 'FFFFFF',
    grey: '#7C8696',
    greyText: '#90959C',
    greyMedium: '#C2C7CE',
    greyDark: '#2E2E2E',
    black: '#121212'
}
const mainnetLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: COLORS.blue,
        secondary: COLORS.blueBright,
        warning: COLORS.orange,
        error: COLORS.red,
        success: COLORS.green,
        purple: COLORS.purple,
        teal: COLORS.teal,
        textPrimary: COLORS.navy,
        info: COLORS.greyText,
        surface: COLORS.offWhite,
        background: COLORS.greyMedium,
        white: COLORS.white,
        'on-background': COLORS.navy,
        'on-surface': COLORS.navy,
        'on-primary': COLORS.white,
        'on-surface-tabs': COLORS.blue
    }
}

const mainnetDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: COLORS.blue,
        secondary: COLORS.blueBright,
        warning: COLORS.orange,
        error: COLORS.red,
        success: COLORS.green,
        purple: COLORS.purple,
        teal: COLORS.teal,
        textPrimary: COLORS.blueLight,
        info: COLORS.greyText,
        surface: COLORS.black,
        background: COLORS.greyDark,
        white: COLORS.blueLight,
        'on-background': COLORS.blueLight,
        'on-surface': COLORS.blueLight,
        'on-primary': COLORS.blueLight,
        'on-secondary': COLORS.blueLight,
        'on-surface-tabs': COLORS.blueLight
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
