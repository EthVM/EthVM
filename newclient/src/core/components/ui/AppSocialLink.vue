<template>
    <i aria-hidden="true" class="v-icon secondary--text fab ${icons[name]} pr-2 material-icons theme--light" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppSocialLink extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(String) platform!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    platforms = {
        facebook: 'fa-facebook-official'
    }
}
</script>
