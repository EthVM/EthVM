<template>
  <v-card flat class="pa-5">
    <v-card-text class="error--text text-xs-center body-2"> {{ messg }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppErrorNoData extends Vue {
  @Prop(String) pageType!: string
  @Prop(String) reference!: string
  @Prop({type: Boolean, default: false}) serverError!: boolean

  //Computed:
  get messg(): string {
    console.log(this.reference)
    return this.serverError ? this.$i18n.t('message.error').toString() : (this.$i18n.t('message.notValid') + this.types.address + ': ' + this.reference).toString()
  }

  get types(): Object {
    return {
      address: this.$i18n.t('title.address').toLowerCase(),
      token: this.$i18n.t('tableHeader.token').toLowerCase(),
      block: this.$i18n.t('title.block').toLowerCase(),
      txs: this.$i18n.t("kb.txs.term").toLowerCase()
    }
  }

}
</script>
