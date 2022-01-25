<template>
    <div class="hash-container font-mono">
        <div v-if="!hasLink" :class="isBlue ? `secondary--text` : `black--text`">
            <div class="firstPart">{{ start }}</div>
            <div class="lastPart">{{ end }}</div>
        </div>
        <router-link v-else :to="link" :class="isBlue ? `secondary--text` : `black--text`">
            <div class="firstPart">{{ start }}</div>
            <div class="lastPart">{{ end }}</div>
        </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppTransformHash extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String) hash!: string
    @Prop({ type: Boolean, default: false }) italic!: boolean
    @Prop(String) link?: string
    @Prop({ type: Boolean, default: true }) isBlue!: boolean

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get start(): string {
        const n = this.hash.length
        return this.hash.slice(0, n - 4)
    }
    get end(): string {
        const n = this.hash.length
        return this.hash.slice(n - 4, n)
    }
    get hasLink(): boolean {
        return !!this.link && this.link !== ''
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    routeTo(): void {
        if (this.link) {
            this.$router.push(this.link).catch(() => {})
        }
    }
}
</script>

<style scoped lang="scss">
// Variables to control the truncation behaviour
$startFixedChars: 4; // Number of chars before ellipsis - have priority over end chars
$endFixedChars: 5; // Number of chars after ellipsis  - lower priority than start chars
$fontFaceScaleFactor: 0.47; // Magic number dependent on font face - set by trial and error

// Dervied from the 3 variables above
$startWidth: 1em * $fontFaceScaleFactor * ($startFixedChars + 3);
$endWidth: 1em * $fontFaceScaleFactor * $endFixedChars;

.firstPart,
.lastPart {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
}
.firstPart {
    max-width: calc(100% - #{$endWidth});
    min-width: $startWidth;
    text-overflow: ellipsis;
}
.lastPart {
    max-width: calc(100% - #{$startWidth});
    direction: rtl;
}
.hash-container {
    white-space: nowrap;
    overflow: hidden;
    line-height: 1rem;
}
</style>
