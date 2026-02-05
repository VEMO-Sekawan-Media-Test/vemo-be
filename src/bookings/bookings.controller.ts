import { Controller, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CompleteBookingDto } from './dto/complete-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.sub);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Approve a booking (level 1 or 2)' })
  approve(@Param('id') id: string, @Request() req) {
    return this.bookingsService.approve(+id, req.user.sub);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reject a booking' })
  reject(@Param('id') id: string, @Request() req) {
    return this.bookingsService.reject(+id, req.user.sub);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete booking with fuel consumption data' })
  complete(@Param('id') id: string, @Body() completeDto: CompleteBookingDto, @Request() req) {
    return this.bookingsService.completeWithFuel(+id, completeDto);
  }
}
