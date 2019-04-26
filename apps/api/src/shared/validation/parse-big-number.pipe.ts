import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import BigNumber from 'bignumber.js';

@Injectable()
export class ParseBigNumberPipe implements PipeTransform<string, BigNumber> {

  constructor() { }

  transform(value: string, metadata: ArgumentMetadata): BigNumber {
    return new BigNumber(value, 16)
  }
}
