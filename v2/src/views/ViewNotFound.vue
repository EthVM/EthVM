<template>
    <div class="not-found">
        <v-container class="core-container py-4 py-md-12">
            <div class="d-flex flex-column align-center justify-center text-center my-5 my-md-16">
                <v-img :src="require('@/assets/vm-bot/vm-bot-error.png')" alt="" height="380" width="380" contain />
                <p class="text-white mt-3 mb-5 text-h3">Oh No! This page is not found.</p>
                <app-btn text="Go Back Home" @click="goToHome"></app-btn>
            </div>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppBtn from '@core/components/AppBtn.vue'
import { ROUTE_NAME } from '@core/router/routesNames'

const router = useRouter()
const goToHome = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.HOME.NAME
    })
}
</script>
<style lang="scss" scoped>
.not-found {
    background: url('/src/assets/background-nebula.png');
    background-size: cover;
    background-attachment: fixed;
    background-position: right 35% center;
    min-height: 600px;
    width: 100;
}
</style>
