import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 * DTO untuk membuat kendaraan baru
 * Berisi informasi lengkap tentang kendaraan yang akan ditambahkan
 */
export class CreateVehicleDto {
  @ApiProperty({ 
    example: 'Toyota HiAce', 
    description: 'Nama model kendaraan (misal: Toyota HiAce, Mitsubishi Fuso)' 
  })
  @IsString()
  @IsNotEmpty()
  modelName: string;

  @ApiProperty({ 
    example: 'B 1234 XYZ', 
    description: 'Nomor polisi kendaraan (harus unik)' 
  })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ 
    example: 'Personnel', 
    enum: ['Personnel', 'Freight'], 
    description: 'Jenis kendaraan: Personnel untuk penumpang, Freight untuk barang' 
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ 
    example: 'Company', 
    enum: ['Company', 'Rental'], 
    description: 'Kepemilikan kendaraan: Company (milik perusahaan) atau Rental (sewa)' 
  })
  @IsString()
  @IsNotEmpty()
  ownership: string;

  @ApiProperty({ 
    example: 'Kantor Pusat', 
    description: 'Lokasi kendaraan: Kantor Pusat, Cabang, Tambang A-F' 
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ 
    example: 0.12, 
    description: 'Konsumsi BBM dalam liter per kilometer' 
  })
  @IsNumber()
  fuelConsumption: number;

  @ApiProperty({ 
    example: '2026-01-15T00:00:00Z', 
    required: false, 
    description: 'Tanggal servis terakhir kendaraan (format ISO 8601)' 
  })
  @IsOptional()
  lastService?: string | Date;
}
