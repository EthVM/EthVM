<template>
    <v-card flat transparent>
        <v-layout column align-center justify-center row fill-height pa-4>
            <v-flex xs12> <v-icon class="fa fa-spinner fa-pulse fa-4x fa-fw primary--text" large></v-icon> </v-flex>
            <v-flex xs12>
                <v-card-title class="primary--text text-xs-center body-2 pb-4">{{ $t('message.load') }}</v-card-title>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class AppInfoLoad extends Vue {}
</script>
