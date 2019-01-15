/// <reference types="node" />
export interface TokenTransfer {
    blockHash: string;
    txIndex: number;
    transferType: string;
    from: string;
    to: string;
    amount: Buffer;
    timestamp: number;
}
