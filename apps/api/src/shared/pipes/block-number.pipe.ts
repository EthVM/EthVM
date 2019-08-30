import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import BigNumber from 'bignumber.js';
import {MetadataService} from '@app/dao/metadata.service';
import {InvalidBlockNumberException} from '@app/shared/errors/invalid-block-number-exception';

@Injectable()
export class BlockNumberPipe implements PipeTransform<BigNumber | undefined, Promise<BigNumber>> {

  constructor(
    private readonly metadataService: MetadataService,
  ) {
  }

  async transform(value?: BigNumber): Promise<BigNumber> {

    let latestBlockNumber = await this.metadataService.latestBlockNumber()

    if (!latestBlockNumber) {
      // TODO create a new error type for no data scenario?
      latestBlockNumber = new BigNumber(0)
    }

    if (value && latestBlockNumber!.isLessThan(value)) {
      throw new InvalidBlockNumberException(`Invalid block number (${value.toString()}). Latest synced block = ${latestBlockNumber.toString()}`)
    }

    return value || latestBlockNumber
  }
}
