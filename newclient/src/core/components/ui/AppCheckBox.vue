<template>
    <v-btn icon small class="ma-0" @click="clickCheckBox"> <v-icon :class="checkBoxClass" /></v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppCheckBox extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop({ type: String, default: '' }) value!: string
    @Prop(Array) valuesArray!: string[]
    @Prop({ type: Boolean, default: false }) isSelectAll!: boolean
    @Prop({ type: Boolean, default: false }) allSelected!: boolean
    @Prop({ type: Boolean, default: false }) isWhite!: boolean

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get isChecked(): boolean {
        if (this.isSelectAll) {
            return this.allSelected
        }
        return this.valuesArray.includes(this.value)
    }

    get checkBoxClass(): string {
        if (this.isChecked) {
            return this.isWhite ? 'fas fa-check-square secondary--text icon-check white-background ' : 'fas fa-check-square secondary--text icon-check'
        }
        return this.isWhite ? 'fas fa-square white--text icon-check' : 'far fa-square info--text icon-check'
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    clickCheckBox(): void {
        if (this.isSelectAll) {
            this.$emit('selectAll')
        } else {
            const newValues = this.isChecked ? this.valuesArray.filter(_value => _value !== this.value) : this.valuesArray.concat(this.value)
            this.$emit('newCheckBoxArray', newValues)
        }
    }
}
</script>

<style scoped lang="css">
.icon-check {
    font-size: 16px;
}
.white-background {
    background: linear-gradient(#8391a8 0, #8391a8 15%, white 15%, white 80%, #8391a8 66%, #8391a8 100%);
}
</style>
