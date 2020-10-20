<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{on}">
            <v-btn outline flat small color="error" class="text-capitalize ma-0" @click.stop="removeAddress()" v-on="on">
                <v-icon class="fas fa-trash-alt pr-2 icon-small" />{{ $t('fav.btn.remove') }}</v-btn
            >
        </template>
        <span class="black--text">{{ $t('fav.tooltip.remove') }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FavBtnRemove extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Function) removeAddress!: void
}
</script>
<style scoped lang="css">
.icon-small {
    font-size: 12px;
}
</style>
