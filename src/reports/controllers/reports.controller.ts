import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse as ApiSwaggerResponse } from '@nestjs/swagger';

/**
 * Controller untuk laporan dan statistik
 * Menangani ekspor data dan statistik pemakaian kendaraan
 */
@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Ekspor semua data pemesanan ke file Excel
   * @param res - Response object untuk mengirim file
   * @returns File Excel containing all booking data
   */
  @Get('export')
  @ApiOperation({ summary: 'Ekspor semua data pemesanan ke file Excel' })
  @ApiSwaggerResponse({ status: 200, description: 'File Excel berhasil diunduh' })
  @ApiSwaggerResponse({ status: 500, description: 'Gagal membuat file Excel' })
  async exportExcel(@Res() res: Response) {
    return this.reportsService.exportBookingsToExcel(res);
  }

  /**
   * Ambil statistik dashboard untuk grafik
   * @returns Data statistik dashboard
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'Ambil statistik dashboard untuk grafik' })
  @ApiSwaggerResponse({ status: 200, description: 'Statistik berhasil diambil' })
  @ApiSwaggerResponse({ status: 500, description: 'Gagal mengambil statistik' })
  async getDashboard() {
    return this.reportsService.getDashboardStats();
  }
}
