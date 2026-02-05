import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const data: any = { ...createVehicleDto };
    if (data.lastService === undefined) {
      delete data.lastService;
    } else if (typeof data.lastService === 'string') {
      data.lastService = new Date(data.lastService);
    }

    return this.prisma.vehicle.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Kendaraan dengan ID ${id} tidak ditemukan`);
    }

    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id); // Check if exists

    const data: any = { ...updateVehicleDto };
    if (data.lastService && typeof data.lastService === 'string') {
      data.lastService = new Date(data.lastService);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
