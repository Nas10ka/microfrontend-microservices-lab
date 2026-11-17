import { Controller, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('health')
  getHealth() {
    return this.bookingsService.getHealth();
  }
}
