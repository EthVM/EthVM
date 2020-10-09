<template>
    <v-card color="white" flat class="pb-2">
        <v-layout align-center justify-center row pl-3 pr-4 mt-1>
            <app-table-title :title="title" :has-pagination="false" :page-type="pageType" page-link="" class="pl-2" />
            <fav-btn-add :add-address="addItem" />
            <v-spacer />
            <fav-btn-remove :remove-address="removeItem" />
        </v-layout>
        <v-divider class="lineGrey mt-1 mb-1" />
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ErrorMessagesFav } from '@app/modules/favorites/models/ErrorMessagesFav'
import { Crumb } from '@app/core/components/props'
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import FavBtnAdd from '@app/modules/favorites/components/FavBtnAdd.vue'
import FavBtnRemove from '@app/modules/favorites/components/FavBtnRemove.vue'

@Component({
    components: {
        AppTableTitle,
        FavBtnAdd,
        FavBtnRemove
    }
})
export default class FavHandlerAddressList extends Vue {
    pageType = 'fav_addresses'
    get title(): string {
        return this.$t('fav.title').toString()
    }

    addItem(): void {
        console.log('adding item')
    }
    removeItem(): void {
        console.log('remove item')
    }
}
</script>
