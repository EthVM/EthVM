import { BlockEntity } from "modules/blocks/block.entity";

export abstract class Query {
  abstract blocks(page: number, limit:number):  Promise<BlockEntity>;
  abstract block(hash?: string):  Promise<BlockEntity>;
}


export type Date = any;
export type JSON = any;
