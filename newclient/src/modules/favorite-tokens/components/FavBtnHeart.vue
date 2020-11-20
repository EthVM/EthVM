<template>
    <v-btn icon fab small class="ma-0" @click="buttonPress()"> <v-img :src="iconImage" height="48px" min-width="30px" contain /></v-btn>
</template>

<script lang="ts">
import { Vue, Mixins, Prop } from 'vue-property-decorator'
import { FavActions } from '@app/modules/favorite-tokens/mixins/FavActions.mixin'
// @Component
export default class FavBtnHeart extends Mixins(FavActions) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Boolean) isAdded!: boolean
    @Prop(String) address!: string
    @Prop(String) symbol!: string

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get iconImage(): string {
        return this.isAdded ? require('@/assets/icon-heart.png') : require('@/assets/icon-heart-outline.png')
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    buttonPress(): void {
        console.log(this)
        this.isAdded ? this.mixinAddToFav(this.symbol, this.address) : this.mixinRemoveFromFav(this.address)
    }
}
</script>
