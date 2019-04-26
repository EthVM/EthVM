import { TransactionReceiptEntity } from "@app/orm/entities/transaction-receipt.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";



@Injectable()
export class ReceiptService {

    constructor(
        @InjectRepository(TransactionReceiptEntity) private readonly receiptRepository: Repository<TransactionReceiptEntity>,
    ) { }

    async findByBlockNumber(...blockNumbers: string[]): Promise<TransactionReceiptEntity[]> {
        return this.receiptRepository.find({ where: { blockNumber: In(blockNumbers) } })
    }

    async findByBlockHash(...blockHashes: string[]): Promise<TransactionReceiptEntity[]> {
        return this.receiptRepository.find({ where: { blockHash: In(blockHashes) } })
    }

    async findByTxHash(...txHashes: string[]): Promise<TransactionReceiptEntity[]> {
        return this.receiptRepository.find({ where: { transactionHash: In(txHashes) } })
    }
}