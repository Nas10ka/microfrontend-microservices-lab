import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsService {
  getHealth() {
    return { status: 'ok', service: 'booking-service', dataSource: 'in-memory-demo' };
  }
}
