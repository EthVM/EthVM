import { createI18n } from 'vue-i18n'
const messages = {
    en: {
        about: {
            what: {
                header: 'What is ethVM',
                body: 'ethVM is a block explorer made by people that put user experience first. We made EthVM so that normal users can monitor blockchain transactions, view portfolio analytics, and even explore NFT collections without feeling like they are doing their taxes…or even worse:using Excel. It is an open source platform that empowers users to do more when it comes to crypto!'
            },
            who: {
                header: 'Who are we?',
                body: 'ethVM is made by the MyEtherWallet team!',
                body2: 'MEW was the first wallet interface in Ethereum and was founded 2 weeks after Ethereum mainnet went live. You can basically call us a crypto OG. Ever since our founding, our mission has been to make products that people love to use.'
            },
            why: {
                header: 'Why did we make ethVM?',
                body: ' We made ethVM so that users, developers, and communities have a beautiful choice when it comes to block explorers. ethVM is open source, which makes it adaptable to any crypto ecosystem. So whether you want a better way to track your contract approvals or a solution for an ambitious new project - this is for you!'
            },
            foot: 'SSPL License, Copyright © 2023 MyEtherWallet Inc. For Terms & conditions visit our GitHub.'
        },
        notFound: {
            text: 'Oh No! This page is not found.',
            homeButton: 'Go Back Home'
        },
        txs: {
            more: 'More',
            header: 'All Transactions',
            isHomeHeader: 'Last Transactions',
            refresh: 'New Txs Found, Refresh'
        },
        common: {
            block: 'Block / Timestamp',
            hash: 'Hash',
            from: 'From',
            to: 'To',
            amount: 'Amount',
            fee: 'Tx Fee',
            status: 'Status'
        }
    },
    ru: {
        about: {
            header: 'What is ethVM ru',
            Body: 'hello world ru'
        }
    }
}

export default createI18n({
    locale: 'en',
    fallbackLocale: 'ru',
    legacy: false,
    messages
})
