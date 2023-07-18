<template>
    <v-row :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card class="pa-4 pa-sm-6" elevation="1" rounded="xl">
                <div style="max-width: 900px">
                    <p class="text-h3 mb-1">Privacy Policy</p>
                    <p class="text-caption text-info mb-6">LAST UPDATED: May 24, 2023</p>
                    <p>
                        At EthVm.com, we understand the importance of protecting your Personal Data and consider it our top priority. This Privacy Policy
                        outlines the types of data we collect and how we collect and use your Personal Data. By using our services or interacting with EthVm,
                        you agree to this Privacy Policy.
                    </p>
                    <p class="text-h6 mb-2 mt-8 font-weight-bold">1. TYPES OF DATA WE COLLECT</p>
                    <p class="mb-1">
                        The Personal Data we collect depends on the circumstances of collection and the service requested or transaction undertaken. It may
                        include (but is not limited to):
                    </p>
                    <p class="mb-1">(a) Personal information, such as name, gender, date of birth, and personal identification numbers;</p>
                    <p class="mb-1">(b) Contact information, such as address, phone number, and email address;</p>
                    <p class="mb-1">(c) Technical information, such as IP address and login information;</p>
                    <p class="mb-1">(d) Statistical data, such as website hits.</p>
                    <p class="mb-1">
                        This Privacy Policy applies to the information we collect about you when using our products or services, unless a different privacy
                        policy is displayed. It also explains your choices about how we use your information.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">2. HOW WE COLLECT PERSONAL DATA</p>
                    <p class="mb-1">
                        We collect Personal Data when you engage with our products and services, create an account with us, or under any other contractual
                        agreement or arrangement. We may also collect information through communications with you via phone, email, or in-person interactions,
                        as well as through our website and support helpdesk.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">3. HOW WE COLLECT PERSONAL DATA ON OUR WEBSITE</p>
                    <p class="mb-1">
                        We collect your Personal Data from our website through various means, including your IP address, cookies, user feedback forms, general
                        site tracking, and web server site visits logging.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">4. WHAT WE USE YOUR PERSONAL DATA FOR</p>
                    <p class="mb-1">
                        We may use your Personal Data for various purposes, including enabling us to provide and perform our services, protecting the safety and
                        well-being of customers, investigating and responding to inquiries, conducting statistical and marketing analysis, complying with legal
                        and regulatory requirements, and communicating offers and information about our products and services.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">5. ACCESSING / CORRECTING / UPDATING YOUR PERSONAL DATA</p>
                    <p class="mb-1">
                        You may request to obtain information about and update or make amendments to your Personal Data by logging into your online account or
                        contacting us. Depending on the information requested, a nominal fee may be charged, and we reserve the right to validate requests for
                        authenticity.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">6. WITHDRAWING CONSENT</p>
                    <p class="mb-1">
                        Processing your Personal Data for Core Purposes is obligatory, without which some services or features may be affected. If you do not
                        consent to processing your Personal Data for Ancillary Purposes, you may unsubscribe from mailing lists, edit account settings, or send
                        a request via Contact Us.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">7. DISCLOSING YOUR PERSONAL DATA</p>
                    <p class="mb-1">
                        We do not trade or sell your Personal Data to third parties, except for those appointed or authorized by the Company for the fulfillment
                        of the Purposes. Your Personal Data may also be disclosed to actual and potential assignees, transferees, or acquirers or our business,
                        assets or group companies, or in connection with any corporate restructuring. We take practical steps to ensure that third parties
                        adhere to the terms of this Privacy Statement.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">8. RETAINING YOUR PERSONAL DATA</p>
                    <p class="mb-1">We store data on global hosting providers and dispose of inactive data after a 24-month period.</p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">9. LINKS TO THIRD-PARTY WEBSITESE</p>
                    <p class="mb-1">
                        Our website and applications may link to Third Party Sites. This Privacy Policy does not apply to Third Party Sites, and we are not
                        responsible for their activities or privacy policies.
                    </p>
                    <p class="text-h6 mt-8 mb-2 font-weight-bold">10. ADDITIONAL INFORMATION OR ASSISTANCE</p>
                    <p class="mb-16">
                        This Privacy Policy may be amended from time to time. For inquiries or complaints regarding your Personal Data or our Privacy Policy, or
                        to access, update or amend your Personal Data, please contact us via our feedback form at Contact Us.
                    </p>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { VIEW_TAGS } from '@core/helper/tags'

useHead({
    title: VIEW_TAGS.PRIVACY_POLICY.title
})
onMounted(() => {
    window.scrollTo(0, 0)
})

const { columnPadding, rowMargin } = useAppViewGrid()
</script>
