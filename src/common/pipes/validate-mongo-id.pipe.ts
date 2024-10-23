import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if(isValidObjectId(value)) {
      return value;
    }else {
      throw new BadRequestException(`${value} is not a valid mongoID`);
    }
  }
}
