export interface RespCollection {
    collection_id: string | null
    name: string | null
    description: string | null
    image_url: string | null
    banner_image_url: string | null
    external_url: string | null
    twitter_username: string | null
    discord_url: string | null
    marketplace_pages: [
        {
            marketplace_id: string
            marketplace_name: string
            marketplace_collection_id: string
            nft_url: string
            collection_url: string
            verified: boolean | null
        }
    ]
    metaplex_mint: string | null
    metaplex_first_verified_creator: string | null
    distinct_owner_count: number | null
    distinct_nft_count: number | null
    spam_score: string | null
    floor_prices: [
        {
            marketplace_id: string
            value: number
            payment_token: {
                payment_token_id: string
                name: string | null
                symbol: string | null
                address: string | null
                decimals: number
            }
        }
    ]
}

export interface RespNFT {
    nft_id: string
    chain: string
    contract_address: string
    token_id: string | null
    name: string | null
    description: string | null
    image_url: string | null
    video_url: string | null
    audio_url: string | null
    model_url: string | null
    previews: {
        image_small_url: string | null
        image_medium_url: string | null
        image_large_url: string | null
        image_opengraph_url: string | null
        blurhash: string | null
    }
    background_color: string | null
    external_url: string | null
    created_date: string | null
    status: string
    token_count: number | null
    owner_count: number | null
    owners: [
        {
            owner_address: string
            quantity: number
            first_acquired_date: string
            last_acquired_date: string
        }
    ]
    contract: {
        type: string
        name: string | null
        symbol: string | null
    }
    collection: RespCollection
    extra_metadata: {
        image_original_url: string | null
        animation_original_url: string | null
        // eslint-disable-next-line
        attributes?: any
        // eslint-disable-next-line
        traits?: any
    }
}

export interface ResponceTokens {
    result: {
        nfts?: RespNFT[]
    }
}

export interface ResponceCollection {
    result: {
        next: string | null
        collections: RespCollection[]
    }
}
