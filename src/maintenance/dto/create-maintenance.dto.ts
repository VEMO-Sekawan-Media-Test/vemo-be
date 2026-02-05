import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

/**
 * DTO untuk menjadwalkan perawatan kendaraan
 * Berisi informasi lengkap tentang perawatan yang akan dijadwalkan
 */
export class CreateMaintenanceDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID kendaraan yang akan di servicing' 
  })
  @IsNumber()
  vehicleId: number;

  @ApiProperty({ 
    example: 'Service rutin mingguan', 
    description: 'Deskripsi atau penyebab perawatan yang perlu dilakukan' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    example: '2026-02-20T09:00:00Z', 
    description: 'Tanggal dan waktu terjadwal perawatan (format ISO 8601)' 
  })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ 
    example: 1500000, 
    description: 'Perkiraan biaya perawatan dalam Rupiah (IDR)' 
  })
  @IsNumber()
  estimatedCost: number;

  @ApiProperty({ 
    example: 'Engine Oil', 
    required: false, 
    description: 'Jenis layanan perawatan (misal: Engine Oil, Tune Up, Ban)' 
  })
  @IsOptional()
  @IsString()
  serviceType?: string;
}
