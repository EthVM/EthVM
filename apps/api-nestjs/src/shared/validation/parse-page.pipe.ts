import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParsePagePipe implements PipeTransform<number, number> {
  constructor() {}

  transform(value: number, metadata: ArgumentMetadata): number {
    if (!value) return 0

    if (value < 0) {
      throw new BadRequestException('Invalid page. Must not be negative.')
    }

    return value
  }
}
