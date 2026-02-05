// src/reports/services/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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

  async getDashboardStats() {
    // Get total vehicles
    const totalVehicles = await this.prisma.vehicle.count();

    // Get active bookings (status = 2 = approved and in progress)
    const activeBookings = await this.prisma.booking.count({
      where: { status: 2 },
    });

    // Get pending approvals (status = 0 or 1)
    const pendingApprovals = await this.prisma.booking.count({
      where: { status: { in: [0, 1] } },
    });

    // Get total fuel used
    const bookingsWithFuel = await this.prisma.booking.findMany({
      where: { fuelUsed: { not: null } },
      select: { fuelUsed: true },
    });
    const totalFuelUsed = bookingsWithFuel.reduce((sum, b) => sum + (b.fuelUsed || 0), 0);

    // Get vehicles by location
    const vehiclesByLocation = await this.prisma.vehicle.groupBy({
      by: ['location'],
      _count: { id: true },
    });
    const locationData: Record<string, number> = {};
    vehiclesByLocation.forEach((v) => {
      locationData[v.location] = v._count.id;
    });

    // Get bookings by month for trend chart
    const bookingsByMonthRaw = await this.prisma.booking.groupBy({
      by: ['startDate'],
      _count: { id: true },
    });
    const monthlyData: Record<string, number> = {};
    bookingsByMonthRaw.forEach((b) => {
      const month = b.startDate.toISOString().slice(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + b._count.id;
    });

    // Get bookings by vehicle type
    const bookingsByTypeRaw = await this.prisma.booking.groupBy({
      by: ['vehicleId'],
      _count: { id: true },
    });
    
    // Get vehicle types
    const vehicles = await this.prisma.vehicle.findMany({
      select: { id: true, type: true },
    });
    const typeMap = new Map(vehicles.map((v) => [v.id, v.type]));
    
    const typeData: Record<string, number> = { Personnel: 0, Freight: 0 };
    bookingsByTypeRaw.forEach((b) => {
      const vehicleType = typeMap.get(b.vehicleId) || 'Personnel';
      if (typeData[vehicleType] !== undefined) {
        typeData[vehicleType] += b._count.id;
      }
    });

    return {
      totalVehicles,
      activeBookings,
      pendingApprovals,
      totalFuelUsed,
      vehiclesByLocation: locationData,
      bookingsByMonth: monthlyData,
      bookingsByVehicleType: typeData,
    };
  }
}
