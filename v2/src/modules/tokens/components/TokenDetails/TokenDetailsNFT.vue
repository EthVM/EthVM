<template>
    <v-row v-if="props.collection" justify="center" class="mx-10 align-start align-lg-center py-7">
        <token-details-collection-img :img-link="props.collection.image_url || undefined" class="mb-5 mb-md-0"></token-details-collection-img>
        <v-col cols="12" md="8" lg="9" class="pl-5">
            <v-row align="center" justify="center">
                <v-col cols="12" lg="8" class="px-sm-5 pr-lg-10">
                    <p class="text-h4 font-weight-bold mb-2">{{ props.collection.name }}</p>
                    <div class="mb-6">
                        <div v-if="props.collection.description" v-html="compiledMarkdown"></div>
                    </div>
                    <div class="d-flex mb-2 mb-lg-0">
                        <p v-if="props.collection.distinct_nft_count" class="mr-6 info--text">
                            items
                            <span class="font-weight-bold black--text">{{ props.collection.distinct_nft_count }}</span>
                        </p>
                        <p v-if="props.collection.distinct_owner_count" class="mr-6 info--text">
                            owners
                            <span class="font-weight-bold black--text">{{ props.collection.distinct_owner_count }}</span>
                        </p>
                        <!-- <p class="mr-6 info--text">
                            floor price <span class="font-weight-bold black--text">{{ props.collection.distinct_owner_count }}</span>
                        </p> -->
                    </div>
                </v-col>
                <v-col cols="12" lg="4" class="px-sm-5 pl-lg-5 pr-lg-0">
                    <p v-if="props.collection.external_url" class="font-weight-bold">Official Website</p>
                    <a v-if="props.collection.external_url" :href="props.collection.external_url" target="_blank">{{ props.collection.external_url }}</a>
                    <!-- <p v-if="showSocial" class="font-weight-bold mt-5">Social</p>
                    <div v-if="showSocial" class="d-flex align-center">
                        <a v-for="(link, index) in socials" :key="index" :href="link.link" target="_blank">
                            <p class="d-sr-only">{{ link.srText }}</p>
                        </a>
                    </div> -->
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import TokenDetailsCollectionImg from './TokenDetailsCollectionImg.vue'
import { computed } from 'vue'
import { NftCollectionFragment } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { marked } from 'marked'
interface PropType {
    isLoading: boolean
    collection?: NftCollectionFragment
}

const props = defineProps<PropType>()

/*
===================================================================================
  Computed Values
===================================================================================
*/

/**
 * Description of the Collection
 */
const compiledMarkdown = computed(() => {
    const renderer = new marked.Renderer()
    const linkRenderer = renderer.link
    renderer.link = (href: string, title: string, text: string) => {
        const localLink = href.startsWith(`${location.protocol}//${location.hostname}`)
        const html = linkRenderer.call(renderer, href, title, text)
        return localLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `)
    }
    const html = marked(props.collection?.description, { renderer })
    return html
})

/*
===================================================================================
  Social Icons
===================================================================================
*/
// const showSocial = computed<boolean>(() => {
//     return !!props.collection?.twitter_username || !!props.collection?.discord_url
// })

// interface Social {
//     link: string
//     img: string
//     srText: string
//     altText: string
// }

// const socials = computed<Social[]>(() => {
//     const _socials: Social[] = []
//     if (showSocial.value) {
//         if (props.collection?.twitter_username) {
//             _socials.push({
//                 link: `https://twitter.com/${props.collection?.twitter_username}`,
//                 img: require('@/assets/social-media/twitter.svg'),
//                 srText: 'Link to twitter',
//                 altText: 'Twitter icon'
//             })
//         }
//         // if (props.collection?.discord_url) {
//         //     socials.push({
//         //         link: props.collection?.twitter_username,
//         //         img: require('@/assets/social-media/twitter.svg'),
//         //         srText: 'Link to discord',
//         //         altText: 'Discord icon'
//         //     })
//         // }
//     }
//     return _socials
// })
</script>
<style scoped lang="scss">
.fill-icon svg text {
    fill: blue !important;
}
</style>
