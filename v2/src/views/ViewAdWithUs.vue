<template>
    <div>
        <!--
        ========================
          Header
        =========================
        -->
        <div :class="[showAd, 'nebula px-2 px-sm-6 mx-xl-auto pt-16']">
            <v-container :class="['px-7 px-lg-12 pt-5 pt-lg-10 pb-16']">
                <div class="pl-lg-14 mt-16">
                    <div class="pt-sm-11 pb-2 pb-md-16 pb-lg-0 text-white font-weight-light text-h3 text-sm-h2 text-md-h1 text-center text-sm-left">
                        <p style="max-width: 671px">Get your brand seen by thousands of MyEtherWallet users. All platforms lead to ethVM.</p>
                    </div>
                    <div :class="mdAndUp ? 'relative-container' : 'd-flex flex-column flex-sm-row align-center justify-center justify-md-space-around'">
                        <v-img
                            :src="require('@/assets/promo/mew-universe.png')"
                            :class="[mdAndUp ? 'floating-universe' : 'mb-5 order-sm-last mb-sm-0 ml-sm-5 mt-sm-n6']"
                            :width="universeWidth"
                            :min-height="mdAndUp ? universeHeight : undefined"
                            scale="1"
                            contain
                            eager
                        />
                        <v-card class="mt-md-16 py-5 px-3 text-center text-white contact-us text-caption" rounded="xl" min-width="211" max-width="221">
                            <p>Let's work together to achieve</p>
                            <p class="mb-3">your marketing goals!</p>
                            <v-btn color="secondary" min-width="134" height="26" rounded="pill" class="contact-us-btn" @click="scrollToForm">Contact Us</v-btn>
                        </v-card>
                    </div>
                </div>
            </v-container>
        </div>
        <!--
        ========================
          Info
        =========================
        -->
        <div class="mx-2 mx-sm-6 mx-xl-auto">
            <v-container class="pt-3 px-0">
                <v-row :class="rowMargin">
                    <!--
                    ========================
                        Ad Options Visuals
                    =========================
                    -->
                    <v-col cols="12" :class="columnPadding">
                        <v-card variant="elevated" elevation="1" rounded="xl" class="px-4 px-sm-6 pt-4 pt-sm-6">
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-card rounded="xl" elevation="0" :border="true" class="pa-6 info-card h-100">
                                        <p class="text-h2 mb-1">3 million</p>
                                        <p>Monthly active MyEtherWallet users</p>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card rounded="xl" elevation="0" :border="true" class="pa-6 info-card h-100">
                                        <p class="text-h2 mb-1">Original ETH Users</p>
                                        <p>Our users date back to 2015,</p>
                                        <p>the launch of Ethereum</p>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card rounded="xl" elevation="0" :border="true" class="pa-6 info-card h-100">
                                        <p class="text-h2 mb-1">5 min 59s</p>
                                        <p>Average visit duration</p>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <p class="mx-3 px-lg-16 mt-12 font-weight-light text-h3 text-sm-h2 text-md-h1 text-center">
                                Get your brand in front of some of the most active users on the blockchain. EthVM was created to serve all of MyEtherWallet's
                                users and beyond. Get in on the Alpha.
                            </p>
                            <v-img :src="require('@/assets/promo/ad-guide.png')" contain cover :min-height="guideHeight" eager class="mx-lg-8" />
                        </v-card>
                    </v-col>
                    <!--
                    ========================
                        Ad Options Info
                    =========================
                    -->
                    <v-col cols="12" :class="columnPadding">
                        <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
                            <v-row no-gutters class="mx-n3 mx-md-n5 my-n3">
                                <v-col cols="12" sm="6" lg="3" class="px-3 px-md-5 py-3">
                                    <v-card rounded="xl" elevation="0" :border="true" class="px-3 py-6 info-card h-100">
                                        <p class="text-center text-h3">Small Buttons</p>
                                        <ul class="pl-6 pr-3">
                                            <li class="py-3 text-h6 pl-3">Target users through natively integrated CTA buttons.</li>
                                            <li class="py-3 text-h6 pl-3">Top of page placement on all pages.</li>
                                            <li class="py-3 text-h6 pl-3">
                                                Displays more information on your brand on hover, and opens your URL in a new page on click.
                                            </li>
                                        </ul>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" sm="6" lg="3" class="px-3 px-md-5 py-3">
                                    <v-card rounded="xl" elevation="0" :border="true" class="px-3 py-6 info-card h-100">
                                        <p class="text-center text-h3">Large Buttons</p>
                                        <ul class="pl-6 pr-3">
                                            <li class="py-3 text-h6 pl-3">Larger native buttons that allow for additional context of the promotion</li>
                                            <li class="py-3 text-h6 pl-3">Above the fold placement on all pages</li>
                                            <li class="py-3 text-h6 pl-3">
                                                Displays more information on your brand on hover, and opens your URL in a new page on click.
                                            </li>
                                        </ul>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" sm="6" lg="3" class="px-3 px-md-5 py-3">
                                    <v-card rounded="xl" elevation="0" :border="true" class="px-3 py-6 info-card h-100">
                                        <p class="text-center text-h3">Small Banners</p>
                                        <ul class="pl-6 pr-3">
                                            <li class="py-3 text-h6 pl-3">Your custom asset for the advertising campaign.</li>
                                            <li class="py-3 text-h6 pl-3">Above the fold placement on all pages.</li>
                                            <li class="py-3 text-h6 pl-3">Responsive design for mobile and desktop.</li>
                                            <li class="py-3 text-h6 pl-3">
                                                Displays more information on your brand on hover, and opens your URL in a new page on click.
                                            </li>
                                        </ul>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" sm="6" lg="3" class="px-3 px-md-5 py-3">
                                    <v-card
                                        rounded="xl"
                                        elevation="0"
                                        :border="true"
                                        class="px-3 py-6 info-card h-100"
                                        :min-height="lgAndUp ? '428' : undefined"
                                    >
                                        <p class="text-center text-h3">Large Banners</p>
                                        <ul class="pl-6 pr-3">
                                            <li class="py-3 text-h6 pl-3">Your custom asset for the biggest splash on the website.</li>
                                            <li class="py-3 text-h6 pl-3">Image anchors each page.</li>
                                            <li class="py-3 text-h6 pl-3">Responsive design for mobile and desktop.</li>
                                            <li class="py-3 text-h6 pl-3">
                                                Displays more information on your brand on hover, and opens your URL in a new page on click.
                                            </li>
                                        </ul>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <!--
                    ========================
                    Form
                    =========================
                    -->
                    <v-col cols="12" :class="columnPadding">
                        <v-card variant="elevated" elevation="1" rounded="xl" id="contact-form">
                            <v-img class="align-start text-white" height="100%" :src="require('/src/assets/nebula/nebula-bg-lg.png')" cover eager>
                                <div class="mx-auto pa-4 pa-sm-6 px-lg-0" color="none" style="max-width: 496px">
                                    <v-row class="flex-column align-center justify-center mt-0 mt-sm-11 pt-1">
                                        <v-col cols="12" class="text-center text-white" style="max-width: 438px">
                                            <p class="font-weight-light text-h3 text-sm-h2 text-md-h1">Are you ready to</p>
                                            <p class="font-weight-light text-h3 text-sm-h2 text-md-h1">advertise with us?</p>
                                            <p class="px-10 px-sm-15 text-caption mb-2">
                                                Send us a message and our team will contact you to discuss options and answer any questions you have.
                                            </p>
                                        </v-col>
                                        <v-col cols="12" class="relative-container">
                                            <v-img
                                                :src="require('@/assets/hero/hero-messanger.png')"
                                                contain
                                                cover
                                                :width="messangerHeight"
                                                :height="messangerHeight"
                                                eager
                                                class="floating-messanger"
                                            />
                                            <v-form validate-on="input" ref="contactInputForm" @update:model-value="onInput">
                                                <v-text-field
                                                    v-model="formState.name"
                                                    label="Name"
                                                    :rules="[rules.required, rules.counter]"
                                                    variant="solo"
                                                    rounded="md"
                                                    flat
                                                    clearable
                                                ></v-text-field>
                                                <v-text-field
                                                    v-model="formState.company"
                                                    label="Company Name"
                                                    :rules="[rules.required, rules.counter]"
                                                    required
                                                    variant="solo"
                                                    rounded="md"
                                                    flat
                                                    clearable
                                                    class="mb-1"
                                                ></v-text-field>
                                                <v-text-field
                                                    v-model="formState.website"
                                                    label="Company Website"
                                                    :rules="[rules.required]"
                                                    required
                                                    variant="solo"
                                                    rounded="md"
                                                    flat
                                                    clearable
                                                    class="mb-1"
                                                ></v-text-field>
                                                <v-text-field
                                                    v-model="formState.contactNumber"
                                                    label="Contact Number"
                                                    :rules="[rules.required]"
                                                    required
                                                    variant="solo"
                                                    rounded="md"
                                                    flat
                                                    clearable
                                                    class="mb-1"
                                                ></v-text-field>
                                                <v-text-field
                                                    v-model="formState.email"
                                                    label="E-mail"
                                                    :rules="[rules.required, rules.email]"
                                                    required
                                                    variant="solo"
                                                    rounded="md"
                                                    flat
                                                    clearable
                                                    class="mb-1"
                                                ></v-text-field>
                                                <v-textarea
                                                    v-model="formState.message"
                                                    label="Message"
                                                    :rules="[rules.required]"
                                                    required
                                                    variant="solo"
                                                    rounded="md"
                                                    flat
                                                    clearable
                                                    class="mb-1"
                                                ></v-textarea>
                                            </v-form>
                                        </v-col>
                                        <app-btn
                                            text="Submit"
                                            class="mt-1 mb-3 mb-sm-15"
                                            min-width="206"
                                            :loading="submissionInProcess"
                                            :disabled="!enableSubmission"
                                            @click="submit"
                                        />
                                    </v-row>
                                </div>
                            </v-img>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script setup lang="ts">
// Components
import AppBtn from '@core/components/AppBtn.vue'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useStore } from '@/store'
import { computed, reactive } from 'vue'
import { onMounted, nextTick, ref } from 'vue'
import configs from '@/configs'
import * as Sentry from '@sentry/vue'
import { VIEW_TAGS } from '@core/helper/tags'
import { usePageMeta } from '@core/composables/use-page-meta/use-page-meta.composable'

usePageMeta(null, VIEW_TAGS.AD_WITH_US)

const { lgAndUp, mdAndUp, md, sm } = useDisplay()
const { columnPadding, rowMargin } = useAppViewGrid()

onMounted(() => {
    window.scrollTo(0, 0)
})

/**------------------------
 * Images Dimensions
 -------------------------*/
const guideHeight = computed<string>(() => {
    if (lgAndUp.value) {
        return '553'
    }
    if (md.value) {
        return '400'
    }
    if (sm.value) {
        return '270'
    }
    return '140'
})
const messangerHeight = computed<string>(() => {
    if (mdAndUp.value) {
        return '252'
    }
    if (sm.value) {
        return '180'
    }
    return '100'
})

const universeWidth = computed<string>(() => {
    if (lgAndUp.value) {
        return '700'
    }
    if (mdAndUp.value) {
        return '550'
    }
    if (sm.value) {
        return '300'
    }
    return '340'
})
const universeHeight = computed<string>(() => {
    if (lgAndUp.value) {
        return '320'
    }
    return '300'
})
/**------------------------
 * Form Data
 -------------------------*/
interface FormData {
    name: string
    company: string
    website: string
    contactNumber: string
    email: string
    message: string
}
const formState = reactive<FormData>({
    name: '',
    company: '',
    website: '',
    contactNumber: '',
    email: '',
    message: ''
})

const rules = {
    required: (value: string) => !!value || 'Required.',
    counter: (value: string) => value.length <= 50 || 'Max 50 characters',
    email: (value: string) => {
        const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    }
}

const scrollToForm = () => {
    const el = document.getElementById('contact-form')
    if (el) {
        nextTick(() => {
            el.scrollIntoView({ behavior: 'smooth' })
        })
    }
}

const enableSubmission = ref(false)
const submissionInProcess = ref(false)

/**
 * Checks if form is valid
 */
const onInput = (newValue: boolean) => {
    if (newValue) {
        enableSubmission.value = true
    } else {
        enableSubmission.value = false
    }
}

const store = useStore()
const contactInputForm = ref<HTMLFormElement | null>(null)
/**
 * Submits info to Form Spree
 */
const submit = () => {
    if (!submissionInProcess.value && enableSubmission.value) {
        const formData = new FormData()
        const keys = Object.keys(formState)
        keys.forEach(key => {
            formData
            formData.append(key, formState[key as keyof FormData])
        })
        submissionInProcess.value = true
        fetch(configs.FORMSPREE, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    submissionInProcess.value = false
                    formState.name = ''
                    formState.company = ''
                    formState.website = ''
                    formState.contactNumber = ''
                    formState.email = ''
                    formState.message = ''
                    store.notify('Your information has been submitted. Thank you for reaching out, you will receive our response within several business days.')
                    contactInputForm.value?.reset()
                }
            })
            .catch(error => {
                Sentry.captureException(`ERROR in form submisssion: ${error}. DATA: ${formData}`)
                store.notify('Something went wrong while submitting your information. Please try again later.')
            })
    }
}

/**
 * show ad
 */
const showAd = computed<string>(() => {
    return store.showAd ? 'mt-n24' : 'mt-n16'
})
</script>

<style lang="scss" scoped>
.contact-us {
    border: thin solid rgb(var(--v-theme-switchThumb));
    background: linear-gradient(140deg, rgba(9, 30, 65, 1) 0%, rgba(0, 101, 255, 1) 100%);
    .contact-us-btn {
        font-size: 11px;
    }
}

.relative-container {
    position: relative;
}
.floating-messanger {
    position: absolute;
    @media only screen and (max-width: 599px) {
        right: -20px;
        top: -40px;
    }
    @media only screen and (min-width: 600px) and (max-width: 904px) {
        top: -80px;
        right: -70px;
    }
    @media only screen and (min-width: 905px) and (max-width: 1239px) {
        right: -150px;
    }
    top: -150px;
    right: -124px;
    z-index: 10;
}
.floating-universe {
    position: absolute;
    @media only screen and (min-width: 905px) and (max-width: 1239px) {
        bottom: -20px;
    }
    bottom: -64px;
    right: -10px;
    z-index: 10;
}

.info-card {
    box-shadow: 0px 6px 20px 0px rgba(24, 43, 75, 0.12) !important;
    border: 1.5px solid rgba(194, 199, 206, 1);
}

.nebula {
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
    height: 100%;
    width: 100;
    background-color: rgb(var(--v-theme-primary)) !important;
}
</style>
