<template>
    <app-table-row>
        <!--
           XS:  Name/Menu Options AND Portfolio Button/Blockie/Hash/Copy
           XS And UP: Portfolio Button/Blockie/Hash/Copy only
        -->
        <v-col cols="12" sm="6" lg="6" class="d-flex align-center justify-start flex-nowrap">
            <module-porfolio-handle-adr :address="props.adr.hash" :name="store.getAddressName(props.adr.hash)" />
            <app-address-blockie :address="props.adr.hash" class="ml-2 mr-4" />
            <div class="overflow-hidden">
                <p v-if="xs" :style="!xs ? 'width: 120px;' : ''" :class="{ 'text-ellipses pr-5': xs }">
                    {{ shortName }}
                </p>
                <app-transform-hash
                    :hash="eth.toCheckSum(props.adr.hash)"
                    :link="`address/${props.adr.hash}`"
                    is-blue
                    class=""
                    :show-name="false"
                    :is-short="mdAndDown"
                />
            </div>
            <v-spacer v-if="xs" />
            <app-copy-to-clip :value-to-copy="eth.toCheckSum(props.adr.hash)" class="ml-2" />
            <app-btn-icon v-if="xs" icon="more_vert" :id="`list-item-menu-${props.adr.hash}`"> </app-btn-icon>
        </v-col>
        <!--
            NAME and Options:
            hidden on xs
        -->
        <v-col sm="6" lg="6" class="d-none d-sm-flex align-center justify-space-between pr-5">
            <p class="text-ellipses">{{ props.adr.name }}</p>
            <app-btn-icon icon="more_vert" :id="`list-item-menu-${props.adr.hash}`"> </app-btn-icon>
        </v-col>
    </app-table-row>
    <!--
       Address Name Options
    -->
    <app-menu min-width="180" :activator="`#list-item-menu-${props.adr.hash}`">
        <v-list-item title="Edit Name" class="py-2" @click="openEditDialog(true)"> </v-list-item>
        <v-divider class="my-1 mx-4" />
        <v-list-item :title="menuTitle" class="py-2" @click="deleteAddress"> </v-list-item>
    </app-menu>
    <!--
        Edit Name Dialog
    -->
    <module-porfolio-handle-adr
        v-if="state.showEdit"
        is-edit-mode
        :address="props.adr.hash"
        :name="props.adr.name"
        :require-name="true"
        @close-module="openEditDialog(false)"
    >
    </module-porfolio-handle-adr>
</template>

<script setup lang="ts">
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@/core/components/AppTransformHash.vue'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import ModulePorfolioHandleAdr from '@module/address/ModulePorfolioHandleAdr.vue'
import AppMenu from '@core/components/AppMenu.vue'
import AppTableRow from '@core/components/AppTableRow.vue'
import { reactive, computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useStore } from '@/store'
import { eth } from '@core/helper/eth'
import { Q_PORTFOLIO, ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { PortfolioItem } from '@/store/helpers'

const store = useStore()
const { xs, mdAndDown, smAndUp } = useDisplay()

interface PropsType {
    adr: PortfolioItem
}
const props = defineProps<PropsType>()

const state = reactive({
    showEdit: false
})

const openEditDialog = (_value: boolean) => {
    state.showEdit = _value
}

const router = useRouter()
const deleteAddress = async (): Promise<void> => {
    if (store.addressHashIsSaved(props.adr.hash)) {
        await router.push({
            name: ROUTE_NAME.PORTFOLIO.NAME,
            query: { t: Q_PORTFOLIO[0] }
        })
    } else {
        store.removeAddress(props.adr.hash, true)
    }
}

const shortName = computed<string>(() => {
    return smAndUp.value && props.adr.name.length > 30 ? `${props.adr.name.substring(0, 27)}...` : props.adr.name
})

const menuTitle = computed<string>(() => {
    return store.addressHashIsSaved(props.adr.hash) ? 'View in Portfolio' : 'Delete'
})
</script>
