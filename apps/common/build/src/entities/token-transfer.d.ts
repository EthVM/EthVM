export interface TokenTransfer {
    contract: string;
    blockHash: string;
    txIndex: number;
    transferType: string;
    from: string;
    to: string;
    amount: string;
    timestamp: number;
}
