<template>
    <v-btn icon fab class="ma-0" @click.stop="likeToken()" v-on="on"> <v-img :src="iconImage" height="48px" min-width="30px" contain /></v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FavBtnHeart extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Boolean) isAdded!: boolean
    @Prop(Function) likeToken!: void
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
