export interface META {
    title: string
    description: string
}
export interface PAGE {
    [key: string]: META
}

export const VIEW_TAGS: PAGE = {
    HOME: {
        title: 'ethVM - Track, Analyze and Explore the Ethereum Blockchain',
        description: 'ethVM is a blockchain explorer created by MyEtherWallet. Explore the Ethereum Blockchain easily and analyze crypto transactions.'
    },
    ABOUT: {
        title: 'About Us | The best blockchain explorer from MyEtherWallet',
        description: 'Learn about ethVM and what makes us your new favorite blockchain explorer. Created with love by MyEtherWallet.'
    },
    ADR_OVERVIEW: {
        title: 'Ethereum Address Overview | *** | ethVM ',
        description: 'View Ethereum Address *** and analyze its Ethereum transactions, balances and more with ethVM.'
    },
    ADR_ETH: {
        title: 'Ethereum Address ETH Balance | *** | ethVM',
        description: 'Address ETH balance and history for the Ethereum wallet address ***. Analyze transfers, transactions and value with ethVM.'
    },
    ADR_NFT: {
        title: 'Ethereum Address NFTs | *** |  ethVM',
        description: 'View NFT collections on Ethereum wallet ***. See NFT transfers and transaction details with ethVM.'
    },
    ADR_TOKENS: {
        title: 'Ethereum Address Tokens | *** | ethVM',
        description: 'Token balances for the Ethereum address ***. View all tokens with ethVM, a blockchain explorer from MyEtherWallet.'
    },
    AD_WITH_US: {
        title: 'Advertise with MyEtherWallet and ethVM',
        description: 'Contact us to begin advertising to the millions of users on ethVM and MyEtherWallet.'
    },
    BLOCK: {
        title: 'Ethereum Block *** | Blockchain Explorer | ethVM',
        description:
            'View Ethereum block details on ethVM. Analyze Ethereum transactions, gas details and more with your new favorite blockchain explorer ethVM.'
    },
    BLOCKS: {
        title: 'Ethereum Blocks | Ethereum Blockchain Explorer | ethVM',
        description:
            'Analyze blocks on the Ethereum blockchain. View block numbers, transactions, miners, stake withdrawals and more on ethVM. Made by MyEtherWallet.'
    },
    TX: {
        title: 'Ethereum Transactions Details | *** | ethVM',
        description: 'Transaction details on the Ethereum blockchain. View gas, hash and much more on ethVM, a blockchain explorer from MyEtherWallet.'
    },
    TXS: {
        title: 'Ethereum Transactions | View Blockchain Transactions | ethVM',
        description: 'View Ethereum transactions on ethVM, a blockchain explorer from MyEtherWallet. Manage and verify your crypto easily!'
    },
    NOT_FOUND: {
        title: 'ethVM - Track, Analyze and Explore the Ethereum Blockchain',
        description: 'ethVM is a blockchain explorer created by MyEtherWallet. Explore the Ethereum Blockchain easily and analyze crypto transactions.'
    },
    PORTFOLIO: {
        title: 'Ethereum | Your Portfolio | ethVM',
        description: 'Manage your crypto portfolio with ethVM. Take control of your crypto easily with the blockchain explorer from MyEtherWallet.'
    },
    PRIVACY_POLICY: {
        title: 'Privacy Policy | Ethereum Blockchain Explorer | ethVM',
        description: 'Privacy Policy for ethVM. Read how we are protecting user data and keeping crypto secure.'
    },
    SETTINGS: {
        title: 'Settings | Ethereum Blockchain Explorer | ethVM',
        description: ''
    },
    TOKEN: {
        title: 'Ethereum Contract Detail | *** | ethVM',
        description: 'View Ethereum contract details for *** on ethVM, the blockchain explorer made by MyEtherWallet.'
    },
    UNCLE: {
        title: 'Ethereum Uncle Block *** | Blockchain Explorer | ethVM',
        description: 'View Ethereum uncle details on ethVM and more with your new favorite blockchain explorer ethVM.'
    },
    TOKENS: {
        title: 'Ethereum Tokens | View Top Tokens | ethVM',
        description: 'Tokens on the Ethereum blockchain. Find the next big movers in crypto on the ethVM blockchain explorer.'
    }
}
