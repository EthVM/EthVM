<template>
    <div v-if="hasError">
        <v-card flat class="pa-5">
            <v-layout class="error--text headline justify-center align-center">
                <!-- <i class="fas fa-exclamation-circle text-lg-center mr-3 mb-2"></i> -->
                {{ errorText }}
            </v-layout>
            <!-- <v-layout class="justify-center"><img src="https://media.giphy.com/media/cegWQ66TiGYDK/giphy.gif"/></v-layout> -->
            <v-layout class="justify-center subheading text-md-center">
                {{ message }}
            </v-layout>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppError extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Boolean) hasError!: boolean
    @Prop(String) message!: string

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get errorText() {
        return this.$i18n.t('message.err').toString()
    }
}
</script>
