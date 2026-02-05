import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VehiclesService } from '../services/vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

/**
 * Controller untuk manajemen kendaraan
 * Menampilkan, membuat, mengubah, dan menghapus data kendaraan
 */
@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * Membuat kendaraan baru
   * @param createVehicleDto - Data kendaraan yang akan ditambahkan
   * @returns Data kendaraan yang telah dibuat
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Membuat kendaraan baru' })
  @ApiResponse({ status: 201, description: 'Kendaraan berhasil dibuat' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * Ambil semua data kendaraan
   * @returns Daftar semua kendaraan
   */
  @Get()
  @ApiOperation({ summary: 'Ambil semua data kendaraan' })
  @ApiResponse({ status: 200, description: 'Daftar kendaraan berhasil diambil' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  /**
   * Ambil data kendaraan berdasarkan ID
   * @param id - ID kendaraan yang dicari
   * @returns Data kendaraan yang ditemukan
   */
  @Get(':id')
  @ApiOperation({ summary: 'Ambil data kendaraan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Kendaraan berhasil ditemukan' })
  @ApiResponse({ status: 404, description: 'Kendaraan tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  /**
   * Mengubah data kendaraan
   * @param id - ID kendaraan yang akan diubah
   * @param updateVehicleDto - Data perubahan kendaraan
   * @returns Data kendaraan yang telah diubah
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mengubah data kendaraan' })
  @ApiResponse({ status: 200, description: 'Kendaraan berhasil diubah' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  @ApiResponse({ status: 404, description: 'Kendaraan tidak ditemukan' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(+id, updateVehicleDto);
  }

  /**
   * Menghapus kendaraan
   * @param id - ID kendaraan yang akan dihapus
   * @returns Pesan keberhasilan penghapusan
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Menghapus kendaraan' })
  @ApiResponse({ status: 200, description: 'Kendaraan berhasil dihapus' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token JWT tidak valid' })
  @ApiResponse({ status: 404, description: 'Kendaraan tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
}
