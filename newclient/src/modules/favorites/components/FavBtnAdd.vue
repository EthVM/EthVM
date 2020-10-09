<template>
    <v-tooltip top color="white" content-class="tooltip-border">
        <template #activator="{on}">
            <v-btn small depressed color="secondary" class="text-capitalize ma-0 pa-0 btn-width" @click.stop="editAddress()" v-on="on">
                <v-icon class="fas fa-plus pr-2 icon-small" />Add</v-btn
            >
        </template>
        <span class="black--text">{{ $t('fav.tooltip.add') }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FavBtnAdd extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Function) addAddress!: void
}
</script>
<style scoped lang="css">
.icon-small {
    font-size: 12px;
}
.v-btn {
    min-width: 65px !important;
}
</style>
