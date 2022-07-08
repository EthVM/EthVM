// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
type ThemeDefinition = typeof ThemeDefinition

const mainnetTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: '#3d55a5',
        secondary: '#6270fc',
        accent: '#4a67c6',
        success: '#92cce1',
        warning: '#fed9a1',
        error: '#fe8778',
        info: '#8391a8',
        nav: '#a0a8fd',
        txSuccess: '#00b173',
        txFail: '#fe1377',
        txPen: '#eea66b',
        lineGrey: '#efefef',
        tableGrey: '#fbfcfe',
        tabActive: '#3844b8',
        uncleGrey: '#eff1f6',
        sync: '#ffe7d6',
        bttnGrey: '#dee5f0',
        bttnToken: '#303030',
        bttnReport: '#1EEEA6',
        linkBlue: '#3965e8',
        primaryLight: '#465a9c',
        errorLight: '#fe7665',
        warningLight: '#fed18e',
        successLight: '#97c9dc',
        menuDark: '#2a3643',
        greyPlaceholder: '#afafaf'
    }
}

export default createVuetify({
    theme: {
        defaultTheme: 'mainnetTheme',
        themes: {
            mainnetTheme
        }
    }
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
