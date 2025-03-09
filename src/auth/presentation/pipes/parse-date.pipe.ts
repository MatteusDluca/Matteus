// src/auth/presentation/pipes/parse-date.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: any) {
    try {
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        throw new Error('Data inválida');
      }

      return date;
    } catch (error) {
      throw new BadRequestException('Data inválida. Use o formato YYYY-MM-DD');
    }
  }
}
