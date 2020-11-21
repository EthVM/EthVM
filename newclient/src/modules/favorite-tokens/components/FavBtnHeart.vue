<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{on}">
            <v-btn icon fab small class="ma-0" v-on="on" @click="clickBtn"> <v-img :src="iconImage" height="48px" min-width="30px" contain /></v-btn>
        </template>
        <span class="black--text">{{ tooltipText }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { FavActions } from '@app/modules/favorite-tokens/mixins/FavActions.mixin'
@Component
export default class FavBtnHeart extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Boolean) isAdded!: boolean
    @Prop(Function) clickBtn!: void
    @Prop(String) tooltipText!: string
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get iconImage(): string {
        return this.isAdded ? require('@/assets/icon-heart.png') : require('@/assets/icon-heart-outline.png')
    }
}
</script>
