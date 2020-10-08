<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{on}">
            <v-btn icon fab class="ma-0" @click.stop="editAddress()" v-on="on">
                <v-img :src="require('@/assets/icon-edit')" height="30px" min-width="30px" contain
            /></v-btn>
        </template>
        <span class="black--text">{{ $t('fav.tooltip.edit') }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FavBtnEdit extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Function) editAddress!: void
}
</script>
