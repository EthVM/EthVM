<template>
    <v-container grid-list-lg class="mb-0">
        <v-layout align-center justify-center column class="mb-4">
            <v-flex xs12>
                <v-img :src="require('@/assets/no-data.png')" min-width="300px" min-height="50px" contain></v-img>
            </v-flex>
            <v-flex xs12>
                <h3 class="text-xs-center mb-3">{{ $t('message.error.search.you-entered') }}: {{ searchTerm }}</h3>
                <h3 class="text-xs-center">{{ $t('message.error.search.invalid') }}</h3>
                <i18n path="message.error.search.is-bug" tag="h3" class="text-xs-center">
                    <a slot="let-us-know" :href="`mailto:${supportEmail}`"> {{ $t('message.error.search.let-us-know') }} </a>
                </i18n>
            </v-flex>
            <v-flex xs12>
                <v-btn color="secondary" depressed class="text-capitalize mt-4" to="/">{{ $t('btn.back-home') }}</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class PageNotFound extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String }) searchTerm!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    supportEmail = 'support@ethvm.com'
}
</script>
