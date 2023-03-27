<template>
    <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
        <v-row align="start" justify="start">
            <v-col cols="6">
                <p class="font-weight-bold text-h5">Address Names</p>
                <p class="">Add custom names to addresses in order to easily track them through ethVM</p>
            </v-col>
            <v-col cols="6" class="d-flex align-center justify-end">
                <app-btn text="import" class="ml-5"></app-btn>
                <app-btn text="export"></app-btn>
            </v-col>
            <!--
                FILTER
            -->
            <v-col cols="12" class="d-flex align-center justify-space-between">
                <div class="flex-grow-1 my-5">
                    <app-input place-holder="Search by hash or name" v-model="state.searchParams" />
                </div>
            </v-col>
            <!--
                HEADER/SORT
            -->
            <v-row :dense="xs" :class="'d-flex text-body-1 text-info mb-0'" :justify="xs ? 'end' : 'start'">
                <v-col cols sm="6" lg="6" class="py-0 d-none d-sm-block">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.HASH)">
                        Address
                        <v-icon v-if="isActiveSort(SORT_KEY.HASH)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-col>
                <v-col sm="6" lg="6" class="py-0 d-none d-sm-block">
                    <v-btn variant="text" color="info" class="font-weight-regular ml-n3" rounded="pill" size="small" @click="sortTable(SORT_KEY.NAME)">
                        Name
                        <v-icon v-if="isActiveSort(SORT_KEY.NAME)" class="ml-1" :size="14">{{ sortIcon }}</v-icon></v-btn
                    >
                </v-col>
            </v-row>
            <v-divider class="mx-n4 mx-sm-n6 mt-sm-3" />
            <v-col cols="12">
                <template v-if="addressList.length > 0">
                    <div class="p-ten-top">
                        <table-row-adr-name v-for="adr in addressList" :key="adr.hash" :adr="adr"></table-row-adr-name>
                    </div>
                </template>
                <template v-else>
                    <app-no-result :text="`You did not namy any  addresses yet`" class="mt-3"></app-no-result>
                </template>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import AppBtn from '@/core/components/AppBtn.vue'
import AppInput from '@/core/components/AppInput.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import TableRowAdrName from './components/TableRowAdrName.vue'
import { onMounted, computed, watch, ref, reactive } from 'vue'
import { useStore } from '@/store'
import { useTheme } from 'vuetify'
import { themes } from '@core/plugins/vuetify'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs } = useDisplay()
const store = useStore()

const addressList = computed(() => {
    return [...store.portfolio, ...store.adrBook]
})

enum SORT_KEY {
    NAME = 'name',
    HASH = 'hash'
}
const SORT_DIR = {
    HIGH: 'high',
    low: 'low'
}
interface ComponentState {
    sortKey: string
    sortDirection: string
    searchParams: string
}

const state: ComponentState = reactive({
    sortKey: SORT_KEY.NAME,
    sortDirection: SORT_DIR.HIGH,
    searchParams: ''
})

const sortIcon = computed<string>(() => {
    return state.sortDirection.includes(SORT_DIR.HIGH) ? 'south' : 'north'
})

const isActiveSort = (key: SORT_KEY): boolean => {
    return state.sortKey.includes(key)
}

// watch(
//     () => store.appTheme,
//     (val: string) => {
//         theme.global.name.value = val
//         isDarkMode.value = theme.global.name.value === themes.dark
//     }
// )

// const switchColor = computed<string>(() => {
//     return isDarkMode.value ? 'secondary' : 'secondary'
// })

// onMounted(() => {
//     window.scrollTo(0, 0)
//     isDarkMode.value = theme.global.name.value === themes.dark
// })
</script>

<style lang="scss" scoped>
// .theme-toggle {
//     :deep(.v-input__control) {
//         justify-self: flex-end;
//     }

//     :deep(.v-label) {
//         opacity: 1;
//     }
// }
</style>
