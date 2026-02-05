import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('export-excel')
  @ApiOperation({ summary: 'Export semua data pemesanan ke file Excel' })
  async exportExcel(@Res() res: Response) {
    return this.reportsService.exportBookingsToExcel(res);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Ambil data statistik pemakaian kendaraan untuk grafik',
  })
  async getStats() {
    return this.reportsService.getVehicleUsageStats();
  }
}
