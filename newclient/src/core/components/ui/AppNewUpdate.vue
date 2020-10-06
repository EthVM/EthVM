<template>
    <v-btn
        v-if="display"
        :class="['new-block-alert', 'text-capitalize', 'ma-0', $vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'caption' : '']"
        flat
        @click="onReload"
    >
        {{ buttonText }}
        <v-icon class="ml-2 secondary--text fas fa-sync small-global-icon-font"></v-icon>
    </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppNewUpdate extends Vue {
    /*
    ===================================================================================
      Props:
    ===================================================================================
  */
    @Prop({ type: String, default: '' }) text!: string
    @Prop({ type: Number, default: 0 }) updateCount!: number
    @Prop({ type: Boolean, default: false }) hideCount!: boolean
    /*
    ===================================================================================
      Computed:
    ===================================================================================
  */
    get display(): boolean {
        return this.updateCount > 0
    }

    get buttonText(): string {
        return this.hideCount ? `${this.text}` : `${this.updateCount} ${this.text}`
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
  */
    /**
     * Emits reload to parent
     */
    onReload(): void {
        this.$emit('reload')
    }
}
</script>

<style scoped lang="css">
.new-block-alert {
    height: 44px;
    border: solid 1px #ffb647;
    background-color: rgba(254, 217, 161, 0.25) !important;
}
</style>
