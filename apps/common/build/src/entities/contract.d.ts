export interface Social {
    blog: string;
    chat: string;
    facebook: string;
    forum: string;
    github: string;
    gitter: string;
    instagram: string;
    linkedin: string;
    reddit: string;
    slack: string;
    telegram: string;
    twitter: string;
    youtube: string;
}
export interface Support {
    email: string;
    url: string;
}
export interface Metadata {
    name: string;
    symbol: string;
    decimals: number;
    ens_address: string;
    website: string;
    support: Support;
    social: Social;
}
export interface Contract {
    address: string;
    metadata: Metadata;
    type: string;
}
