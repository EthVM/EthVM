<template>
    <div class="not-found mt-n16">
        <v-container class="core-container pt-16 pb-4 pb-md-12">
            <div class="d-flex flex-column align-center justify-center text-center mt-md-16 mb-5 mb-md-16 pt-md-16">
                <v-img :src="require('@/assets/hero/hero-error.png')" alt="" height="380" width="380" contain />
                <p class="text-white mt-3 mb-5 text-h3">{{ $t('notFound.text') }}</p>
                <app-btn :text="$t('notFound.homeButton')" @click="goToHome"></app-btn>
            </div>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppBtn from '@core/components/AppBtn.vue'
import { ROUTE_NAME } from '@core/router/routesNames'
import { onMounted } from 'vue'

onMounted(() => {
    window.scrollTo(0, 0)
})

const router = useRouter()
const goToHome = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.HOME.NAME
    })
}
</script>
<style lang="scss" scoped>
.not-found {
    @media (max-width: 599px) {
        background: url('/src/assets/nebula/nebula-bg-xs.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    @media only screen and (min-width: 600px) and (max-width: 904px) {
        background: url('/src/assets/nebula/nebula-bg-sm.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right 15% center;
    }
    @media only screen and (min-width: 905px) and (max-width: 1239px) {
        background: url('/src/assets/nebula/nebula-bg-md.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right 35% center;
    }
    @media (min-width: 1240px) {
        background: url('/src/assets/nebula/nebula-bg-lg.png');
        background-position: right 35% center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    background-attachment: fixed;
    min-height: 600px;
    width: 100%;
}
</style>
