<template>
  <v-card flat class="pa-5">
    <v-card-text class="error--text text-xs-center body-2"> {{ messg }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppError extends Vue {
  @Prop(String) pageType!: string
  @Prop(String) reference!: string
  @Prop({ type: Boolean, default: false }) serverError!: boolean

  //Computed:
  get messg(): string {
    return this.serverError
      ? this.$i18n.t('message.error').toString()
      : (this.$i18n.t('message.notValid') + this.types[this.pageType] + ' ' + this.$i18n.t('common.hash').toLowerCase() + ' : ' + this.reference).toString()
  }

  get types(): Object {
    return {
      address: this.$i18n.t('title.address').toLowerCase(),
      token: this.$i18n.t('tableHeader.token').toLowerCase(),
      block: this.$i18n.t('kb.block.term').toLowerCase(),
      tx: this.$i18n.t('kb.txs.term').toLowerCase()
    }
  }
}
</script>
