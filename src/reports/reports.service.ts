// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async exportBookingsToExcel(res: Response) {
    const bookings = await this.prisma.booking.findMany({
      include: {
        vehicle: true,
        creator: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Pemesanan');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Kendaraan', key: 'vehicle', width: 20 },
      { header: 'Plat Nomor', key: 'plate', width: 15 },
      { header: 'Driver', key: 'driver', width: 20 },
      { header: 'Peminjam', key: 'creator', width: 20 },
      { header: 'Mulai', key: 'start', width: 20 },
      { header: 'Selesai', key: 'end', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    bookings.forEach((b) => {
      worksheet.addRow({
        id: b.id,
        vehicle: b.vehicle.modelName,
        plate: b.vehicle.plateNumber,
        driver: b.driverName,
        creator: b.creator.name,
        start: b.startDate.toISOString(),
        end: b.endDate.toISOString(),
        status: b.status === 2 ? 'Approved' : b.status === -1 ? 'Rejected' : 'Pending',
      });
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `Laporan_VEMO_${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
  async getVehicleUsageStats() {
    const stats = await this.prisma.booking.groupBy({
      by: ['vehicleId'],
      _count: {
        id: true,
      },
      where: {
        status: 2, 
      },
    });

    const detailedStats = await Promise.all(
      stats.map(async (stat) => {
        const vehicle = await this.prisma.vehicle.findUnique({
          where: { id: stat.vehicleId },
          select: { modelName: true, plateNumber: true },
        });
        if (!vehicle) {
          return { label: `Kendaraan ID ${stat.vehicleId}`, count: stat._count.id };
        }
        return {
          label: `${vehicle.modelName} (${vehicle.plateNumber})`,
          count: stat._count.id,
        };
      }),
    );

    return detailedStats;
  }
}