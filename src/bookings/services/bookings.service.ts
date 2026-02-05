import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { CompleteBookingDto } from '../dto/complete-booking.dto';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggingService,
  ) {}

  async create(createBookingDto: CreateBookingDto, adminId: number) {
    this.logger.logBookingAction(adminId, 'CREATE', createBookingDto.vehicleId, {
      driverName: createBookingDto.driverName,
      startDate: createBookingDto.startDate,
      endDate: createBookingDto.endDate,
    });

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

    if (!booking) {
      this.logger.warn('Booking not found for approval', 'BookingsService', { bookingId });
      throw new BadRequestException('Pemesanan tidak ditemukan');
    }

    // cek Level 1
    if (booking.approver1Id === userId && booking.status === 0) {
      this.logger.logBookingAction(userId, 'APPROVE_LVL1', bookingId, { previousStatus: 0, newStatus: 1 });
      
      return this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 1 },
      });
    }

    // cek Level 2
    if (booking.approver2Id === userId && booking.status === 1) {
      this.logger.logBookingAction(userId, 'APPROVE_LVL2', bookingId, { previousStatus: 1, newStatus: 2 });
      
      return this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 2 },
      });
    }

    this.logger.warn('Unauthorized approval attempt', 'BookingsService', { bookingId, userId });
    throw new BadRequestException('Bukan otoritas Anda atau status tidak valid');
  }

  async reject(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      this.logger.warn('Booking not found for rejection', 'BookingsService', { bookingId });
      throw new BadRequestException('Pemesanan tidak ditemukan');
    }

    // Approver level 1 or 2 can reject pending bookings
    if ((booking.approver1Id === userId || booking.approver2Id === userId) && booking.status === 0) {
      this.logger.logBookingAction(userId, 'REJECT', bookingId, { previousStatus: 0, newStatus: -1 });
      
      return this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: -1 },
      });
    }

    this.logger.warn('Unauthorized reject attempt', 'BookingsService', { bookingId, userId });
    throw new BadRequestException('Bukan otoritas Anda atau booking tidak bisa ditolak');
  }

  async completeWithFuel(bookingId: number, completeDto: CompleteBookingDto, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) {
      this.logger.warn('Booking not found for completion', 'BookingsService', { bookingId });
      throw new BadRequestException('Pemesanan tidak ditemukan');
    }

    if (booking.status !== 2) {
      this.logger.warn('Booking not approved for completion', 'BookingsService', { bookingId, status: booking.status });
      throw new BadRequestException('Booking harus sudah disetujui terlebih dahulu');
    }

    // Calculate fuel used
    const fuelStart = booking.fuelStart || booking.vehicle.currentFuel;
    const fuelUsed = fuelStart - completeDto.fuelEnd;

    // Calculate fuel consumption rate (liters per km)
    const fuelConsumptionRate = completeDto.distanceKm > 0 
      ? fuelUsed / completeDto.distanceKm 
      : 0;

    this.logger.logBookingAction(userId, 'COMPLETE', bookingId, {
      fuelStart,
      fuelEnd: completeDto.fuelEnd,
      distanceKm: completeDto.distanceKm,
      fuelUsed,
    });

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

      this.logger.logVehicleAction(userId, 'UPDATE_FUEL_RATE', booking.vehicleId, {
        previousRate: currentRate,
        newRate,
      });

      await this.prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { fuelConsumption: newRate },
      });
    }

    return updatedBooking;
  }

  async findAll() {
    this.logger.logSystemEvent('VIEW_ALL', 'View all bookings');
    
    return this.prisma.booking.findMany({
      include: { vehicle: true, creator: true, approver1: true, approver2: true },
    });
  }

  async getPendingApprovals(userId: number) {
    this.logger.logUserAction(userId, 'VIEW_PENDING', 'View pending approvals');
    
    return this.prisma.booking.findMany({
      where: {
        OR: [
          { approver1Id: userId, status: 0 },
          { approver2Id: userId, status: 1 },
        ],
      },
      include: { vehicle: true, creator: true },
    });
  }

  async getAllPendingApprovals() {
    this.logger.logSystemEvent('VIEW_ALL_PENDING', 'View all pending approvals (admin)');
    
    // Status 0 = Menunggu Approver 1, Status 1 = Menunggu Approver 2
    return this.prisma.booking.findMany({
      where: {
        status: {
          in: [0, 1],
        },
      },
      include: { 
        vehicle: true, 
        creator: true,
        approver1: true,
        approver2: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyBookings(userId: number) {
    this.logger.logUserAction(userId, 'VIEW_MY', 'View my bookings');
    
    return this.prisma.booking.findMany({
      where: { creatorId: userId },
      include: { vehicle: true, approver1: true, approver2: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
