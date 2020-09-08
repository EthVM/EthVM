<template>
    <v-container grid-list-lg class="mb-0">
        <v-layout align-center justify-center column class="mb-4">
            <v-flex xs12>
                <v-img :src="require('@/assets/not-found.png')" min-width="300px" min-height="50px" contain></v-img>
            </v-flex>
            <v-flex xs12>
                <h5 class="text-xs-center headline mb-3">{{ $t('message.not-found') }}</h5>
            </v-flex>
            <v-flex xs12>
                <v-btn color="secondary" depressed class="text-capitalize mt-4" to="/">{{ $t('btn.back-home') }}</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageNotFound extends Vue {}
</script>
