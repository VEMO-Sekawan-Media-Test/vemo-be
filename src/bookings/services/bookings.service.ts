import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { CompleteBookingDto } from '../dto/complete-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, adminId: number) {
    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        creatorId: adminId,
        status: 0,
      },
    });
  }

  async approve(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) throw new BadRequestException('Pemesanan tidak ditemukan');

    // cek Level 1
    if (booking.approver1Id === userId && booking.status === 0) {
      return this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 1 },
      });
    }

    // cek Level 2
    if (booking.approver2Id === userId && booking.status === 1) {
      return this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 2 },
      });
    }

    throw new BadRequestException('Bukan otoritas Anda atau status tidak valid');
  }

  async reject(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) throw new BadRequestException('Pemesanan tidak ditemukan');

    // Approver level 1 or 2 can reject pending bookings
    if ((booking.approver1Id === userId || booking.approver2Id === userId) && booking.status === 0) {
      return this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: -1 },
      });
    }

    throw new BadRequestException('Bukan otoritas Anda atau booking tidak bisa ditolak');
  }

  async completeWithFuel(bookingId: number, completeDto: CompleteBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new BadRequestException('Pemesanan tidak ditemukan');

    if (booking.status !== 2) {
      throw new BadRequestException('Booking harus sudah disetujui terlebih dahulu');
    }

    // Calculate fuel used
    const fuelStart = booking.fuelStart || booking.vehicle.currentFuel;
    const fuelUsed = fuelStart - completeDto.fuelEnd;

    // Calculate fuel consumption rate (liters per km)
    const fuelConsumptionRate = completeDto.distanceKm > 0 
      ? fuelUsed / completeDto.distanceKm 
      : 0;

    // Update booking with fuel data
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        fuelStart,
        fuelEnd: completeDto.fuelEnd,
        distanceKm: completeDto.distanceKm,
        fuelUsed,
      },
    });

    // Update vehicle's fuel consumption rate based on actual usage
    if (completeDto.distanceKm > 0) {
      const currentRate = booking.vehicle.fuelConsumption;
      const newRate = (currentRate * 0.7) + (fuelConsumptionRate * 0.3); // Moving average

      await this.prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { fuelConsumption: newRate },
      });
    }

    return updatedBooking;
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: { vehicle: true, creator: true, approver1: true, approver2: true },
    });
  }
}
