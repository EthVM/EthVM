import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import BigNumber from 'bignumber.js';

@Injectable()
export class ParseBigNumberPipe implements PipeTransform<string, BigNumber | null> {

  constructor() { }

  transform(value: string, metadata: ArgumentMetadata): BigNumber | null {
    return value ? new BigNumber(value, 16) : null
  }
}
