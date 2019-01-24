export interface TokenTransfer {
    blockHash: string;
    txIndex: number;
    transferType: string;
    from: string;
    to: string;
    amount: string;
    timestamp: number;
}
