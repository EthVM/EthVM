<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <div class="nebula mb-5 rounded-xl d-flex align-center justify-center">
                    <v-img :src="require('@/assets/hero/hero-group.png')" alt="" :max-height="xs ? '150' : '300'" />
                </div>
                <p class="text-h5 font-weight-bold mb-3">{{ $t('about.what.header') }}</p>
                <p class="mb-15">{{ $t('about.what.body') }}</p>
                <p class="text-h5 font-weight-bold mb-3">{{ $t('about.who.header') }}</p>
                <div class="d-flex align-end justify-start mb-3">
                    <v-img
                        :src="require('@/assets/logo/mew-long.svg')"
                        alt=""
                        min-height="30"
                        min-width="50"
                        max-width="144"
                        max-height="37"
                        contain
                        class="mr-3"
                    />
                    <p>{{ $t('about.who.body') }}</p>
                </div>
                <p class="mb-15">
                    {{ $t('about.who.body2') }}
                </p>
                <p class="text-h5 font-weight-bold mb-3">{{ $t('about.why.header') }}</p>
                <p class="mb-15">
                    {{ $t('about.why.body') }}
                </p>
                <p>{{ $t('about.foot') }}</p>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useHead } from '@unhead/vue'
import { VIEW_TAGS } from '@core/helper/tags'
useHead({
    title: VIEW_TAGS.ABOUT.title,
    meta: [{ name: 'description', content: VIEW_TAGS.ABOUT.description }]
})
const { xs } = useDisplay()
onMounted(() => {
    window.scrollTo(0, 0)
})

const { columnPadding, rowMargin } = useAppViewGrid()
</script>
<style lang="scss" scoped>
.nebula {
    @media (max-width: 599px) {
        background: url('/src/assets/nebula/nebula-bg-xs.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        height: 200px !important;
    }
    @media only screen and (min-width: 600px) and (max-width: 904px) {
        background: url('/src/assets/nebula/nebula-bg-sm.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    @media only screen and (min-width: 905px) and (max-width: 1239px) {
        background: url('/src/assets/nebula/nebula-bg-md.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    @media (min-width: 1240px) {
        background: url('/src/assets/nebula/nebula-bg-lg.png');
        background-position: right 35% center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    background-attachment: fixed;
    height: 340px;
    width: 100%;
    background-color: rgb(var(--v-theme-primary)) !important;
}
</style>
