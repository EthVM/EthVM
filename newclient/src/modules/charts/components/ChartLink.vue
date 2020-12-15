<template>
    <v-container class="block-grey">
        <v-layout row align-center>
            <v-flex xs8 sm7 md8 pb-0 pr-0>
                <v-card-title class="title font-weight-bold pl-0">{{ title }}</v-card-title>
                <v-card-text class="info--text pt-0 pl-0 caption">{{ text }} {{ $t('charts.captions.description') }}</v-card-text>
                <button class="btn-details" @click="reroute(chartId)">{{ $t('btn.details') }}</button>
            </v-flex>
            <v-flex xs4 sm5 md4>
                <v-img :src="require('@/assets/graph-icon.png')" contain height="100"></v-img>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class ChartLink extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop({ type: String, required: true }) chartId!: string

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get title(): string {
        const title = `charts.${this.chartId}.title`
        return `${this.$t(title)}`
    }

    get text(): string {
        const desc = `charts.${this.chartId}.description`
        return `${this.$t(desc)}`
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Reroutes page
     * @param newRoute {String}
     */
    reroute(newRoute: string): void {
        this.$router.push({ path: `chart/${newRoute}` })
    }
}
</script>

<style scoped lang="css">
.block-grey {
    border: 1px solid #b4bfd2;
}
.btn-details {
    border: 1px solid #6270fc;
    color: #6270fc;
    border-radius: 2px;
    padding: 10px 20px;
}
</style>
