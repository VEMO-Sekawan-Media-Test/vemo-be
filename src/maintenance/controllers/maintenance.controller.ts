import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MaintenanceService } from '../services/maintenance.service';
import { CreateMaintenanceDto } from '../dto/create-maintenance.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Controller untuk manajemen perawatan kendaraan
 * Menangani penjadwalan, pemantauan, dan penyelesaian perawatan
 */
@ApiTags('Maintenance')
@ApiBearerAuth()
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  /**
   * Jadwalkan perawatan kendaraan baru
   * @param createMaintenanceDto - Data perawatan yang akan dijadwalkan
   * @returns Data perawatan yang telah dibuat
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Jadwalkan perawatan kendaraan baru' })
  @ApiResponse({ status: 201, description: 'Perawatan berhasil dijadwalkan' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  /**
   * Ambil semua data perawatan kendaraan
   * @returns Daftar semua perawatan
   */
  @Get()
  @ApiOperation({ summary: 'Ambil semua data perawatan kendaraan' })
  @ApiResponse({ status: 200, description: 'Daftar perawatan berhasil diambil' })
  findAll() {
    return this.maintenanceService.findAll();
  }

  /**
   * Ambil perawatan yang akan datang dalam rentang hari tertentu
   * @param days - Jumlah hari ke depan (default: 7)
   * @returns Daftar perawatan yang akan datang
   */
  @Get('upcoming')
  @ApiOperation({ summary: 'Ambil perawatan yang akan datang' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Jumlah hari ke depan (default: 7)' })
  @ApiResponse({ status: 200, description: 'Daftar perawatan yang akan datang berhasil diambil' })
  getUpcoming(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.maintenanceService.getUpcomingMaintenance(daysNum);
  }

  /**
   * Ambil riwayat perawatan kendaraan tertentu
   * @param id - ID kendaraan
   * @returns Riwayat perawatan kendaraan
   */
  @Get('vehicle/:id')
  @ApiOperation({ summary: 'Ambil riwayat perawatan kendaraan' })
  @ApiResponse({ status: 200, description: 'Riwayat perawatan berhasil diambil' })
  @ApiResponse({ status: 404, description: 'Kendaraan tidak ditemukan' })
  getVehicleHistory(@Param('id') id: string) {
    return this.maintenanceService.getVehicleMaintenanceHistory(+id);
  }

  /**
   * Ambil data perawatan berdasarkan ID
   * @param id - ID perawatan yang dicari
   * @returns Data perawatan yang ditemukan
   */
  @Get(':id')
  @ApiOperation({ summary: 'Ambil data perawatan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Perawatan berhasil ditemukan' })
  @ApiResponse({ status: 404, description: 'Perawatan tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(+id);
  }

  /**
   * Tandai perawatan sebagai selesai
   * @param id - ID perawatan yang akan diselesaikan
   * @param body - Data penyelesaian (biaya aktual dan catatan)
   * @returns Data perawatan yang telah diselesaikan
   */
  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tandai perawatan sebagai selesai' })
  @ApiResponse({ status: 200, description: 'Perawatan berhasil diselesaikan' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  @ApiResponse({ status: 404, description: 'Perawatan tidak ditemukan' })
  complete(
    @Param('id') id: string,
    @Body() body: { actualCost?: number; notes?: string },
  ) {
    return this.maintenanceService.complete(+id, body.actualCost, body.notes);
  }
}
