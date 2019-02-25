export interface TokenExchangeRate {
    name: string;
    symbol: string;
    address: string;
    image: string;
    current_price: number;
    circulating_supply: string;
    high_24: number;
    low_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    market_cap_rank: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    total_volume: number;
    last_updated: number;
}
