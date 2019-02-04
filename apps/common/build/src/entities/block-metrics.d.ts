export interface BlockMetrics {
    avgGasLimit: string;
    avgGasPrice: string;
    avgTxFees: string;
    difficulty: string;
    hash: string;
    numFailedTxs: number;
    numPendingTxs: number;
    numSuccessfulTxs: number;
    numUncles: number;
    totalGasPrice: string;
    totalTxsFees: string;
    totalTxs: number;
}
