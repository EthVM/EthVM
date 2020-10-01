<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{on}">
            <v-btn icon fab class="ma-1" @click.stop="addAddress()" v-on="on"> <v-icon :class="iconClass" large /></v-btn>
        </template>
        <span class="black--text">{{ tooltipText }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FavBtnAddToFav extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Boolean) isAdded!: boolean
    @Prop(Function) addAddress!: void
    @Prop(String) tooltipText!: string

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get iconClass(): string {
        return this.isAdded ? 'fas fa-heart red--text' : 'far fa-heart black--text'
    }
}
</script>
