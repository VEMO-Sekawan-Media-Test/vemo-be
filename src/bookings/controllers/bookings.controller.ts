import { Controller, Post, Body, Patch, Param, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { CompleteBookingDto } from '../dto/complete-booking.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Controller untuk manajemen pemesanan kendaraan
 * Menangani pembuatan, persetujuan, dan penyelesaian pemesanan
 */
@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Mengambil semua data pemesanan
   * @returns Array semua pemesanan
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mengambil semua data pemesanan' })
  @ApiResponse({ status: 200, description: 'Data pemesanan berhasil diambil' })
  findAll() {
    return this.bookingsService.findAll();
  }

  /**
   * Mengambil pemesanan yang menunggu persetujuan approver
   * @param req - Informasi user dari JWT token
   * @returns Array pemesanan yang menunggu persetujuan
   */
  @Get('pending-approvals')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mengambil pemesanan yang menunggu persetujuan' })
  @ApiResponse({ status: 200, description: 'Data pemesanan berhasil diambil' })
  getPendingApprovals(@Request() req) {
    return this.bookingsService.getPendingApprovals(req.user.sub);
  }

  /**
   * Mengambil pemesanan yang dibuat oleh user
   * @param req - Informasi user dari JWT token
   * @returns Array pemesanan user
   */
  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mengambil pemesanan saya' })
  @ApiResponse({ status: 200, description: 'Data pemesanan berhasil diambil' })
  getMyBookings(@Request() req) {
    return this.bookingsService.getMyBookings(req.user.sub);
  }

  /**
   * Mengambil semua pemesanan yang menunggu persetujuan (untuk admin)
   * @returns Array semua pemesanan yang menunggu persetujuan
   */
  @Get('all-pending-approvals')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mengambil semua pemesanan yang menunggu persetujuan (admin only)' })
  @ApiResponse({ status: 200, description: 'Data pemesanan berhasil diambil' })
  getAllPendingApprovals() {
    return this.bookingsService.getAllPendingApprovals();
  }

  /**
   * Membuat pemesanan kendaraan baru
   * @param createBookingDto - Data pemesanan kendaraan
   * @param req - Informasi user dari JWT token
   * @returns Data pemesanan yang dibuat
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Membuat pemesanan kendaraan baru' })
  @ApiResponse({ status: 201, description: 'Pemesanan berhasil dibuat' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.sub);
  }

  /**
   * Setujui pemesanan kendaraan (level 1 atau 2)
   * @param id - ID pemesanan yang akan disetujui
   * @param req - Informasi user dari JWT token
   * @returns Data pemesanan yang telah disetujui
   */
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Setujui pemesanan kendaraan (level 1 atau 2)' })
  @ApiResponse({ status: 200, description: 'Pemesanan berhasil disetujui' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  @ApiResponse({ status: 403, description: 'Forbidden - Tidak memiliki akses untuk Setujui' })
  approve(@Param('id') id: string, @Request() req) {
    return this.bookingsService.approve(+id, req.user.sub);
  }

  /**
   * Tolak pemesanan kendaraan
   * @param id - ID pemesanan yang akan ditolak
   * @param req - Informasi user dari JWT token
   * @returns Data pemesanan yang telah ditolak
   */
  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tolak pemesanan kendaraan' })
  @ApiResponse({ status: 200, description: 'Pemesanan berhasil ditolak' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  reject(@Param('id') id: string, @Request() req) {
    return this.bookingsService.reject(+id, req.user.sub);
  }

  /**
   * Menyelesaikan pemesanan dengan data konsumsi BBM
   * @param id - ID pemesanan yang akan diselesaikan
   * @param completeDto - Data penyelesaian (BBM akhir, jarak tempuh)
   * @param req - Informasi user dari JWT token
   * @returns Data pemesanan yang telah diselesaikan
   */
  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Selesaikan pemesanan dengan data konsumsi BBM' })
  @ApiResponse({ status: 200, description: 'Pemesanan berhasil diselesaikan' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  complete(@Param('id') id: string, @Body() completeDto: CompleteBookingDto, @Request() req) {
    const userId = req.user?.id || 0;
    return this.bookingsService.completeWithFuel(+id, completeDto, userId);
  }
}
