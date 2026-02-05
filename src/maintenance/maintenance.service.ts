import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const scheduledDate = new Date(createMaintenanceDto.scheduledDate);

    return this.prisma.maintenance.create({
      data: {
        vehicleId: createMaintenanceDto.vehicleId,
        description: createMaintenanceDto.description,
        scheduledDate,
        estimatedCost: createMaintenanceDto.estimatedCost,
        serviceType: createMaintenanceDto.serviceType,
      },
    });
  }

  async findAll() {
    return this.prisma.maintenance.findMany({
      include: { vehicle: true },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async findOne(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!maintenance) {
      throw new NotFoundException(`Maintenance dengan ID ${id} tidak ditemukan`);
    }

    return maintenance;
  }

  async complete(id: number, actualCost?: number, notes?: string) {
    await this.findOne(id);

    return this.prisma.maintenance.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
        actualCost: actualCost ?? undefined,
        notes: notes ?? undefined,
      },
    });
  }

  async getUpcomingMaintenance(days: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.maintenance.findMany({
      where: {
        scheduledDate: {
          lte: futureDate,
        },
        status: 'SCHEDULED',
      },
      include: { vehicle: true },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getVehicleMaintenanceHistory(vehicleId: number) {
    return this.prisma.maintenance.findMany({
      where: { vehicleId },
      include: { vehicle: true },
      orderBy: { scheduledDate: 'desc' },
    });
  }
}
