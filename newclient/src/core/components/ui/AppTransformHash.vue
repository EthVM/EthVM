<template>
    <div class="transform-hash-container">
        <router-link v-if="link" :to="url" :class="[hashClass, 'font-mono hash-container force-select url']" tag="li">
            <span class="concat">{{ start }}</span> <span>{{ end }}</span>
        </router-link>
        <span v-else :class="[hashClass, 'force-select font-mono hash-container']">
            <span class="concat">{{ start }}</span>
            <span>{{ end }}</span>
        </span>
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
    @Prop(String) link!: string
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
    get hashClass(): string {
        if (!this.isBlue) {
            return this.italic ? 'font-italic black--text ' : 'black--text'
        }
        return this.italic ? ' font-italic secondary--text ' : 'secondary--text'
    }

    get url(): string {
        return this.link
    }
}
</script>

<style scoped lang="css">
.concat {
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 20px;
}
.transform-hash-container {
    overflow: hidden;
    padding: 0px 1px;
}
.hash-container {
    min-width: 80px;
    display: flex;
    flex-shrink: 2;
}
.force-select {
    -webkit-user-select: all; /* Chrome 49+ */
    -moz-user-select: all; /* Firefox 43+ */
    -ms-user-select: all; /* No support yet */
    user-select: all;
}
.hash-section {
    display: inline;
}

.url:hover {
    text-decoration: underline;
}
</style>
