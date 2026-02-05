import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

/**
 * DTO untuk membuat pemesanan kendaraan
 * Berisi informasi lengkap tentang pemesanan yang akan dibuat
 */
export class CreateBookingDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID kendaraan yang akan dipesan' 
  })
  @IsInt()
  vehicleId: number;

  @ApiProperty({ 
    example: 'Budi Santoso', 
    description: 'Nama driver yang akan mengemudikan kendaraan' 
  })
  @IsString()
  @IsNotEmpty()
  driverName: string;

  @ApiProperty({ 
    example: 2, 
    description: 'ID atasan level 1 yang akan menyetujui pemesanan' 
  })
  @IsInt()
  approver1Id: number;

  @ApiProperty({ 
    example: 3, 
    description: 'ID atasan level 2 yang akan menyetujui pemesanan' 
  })
  @IsInt()
  approver2Id: number;

  @ApiProperty({ 
    example: '2026-02-10T08:00:00Z', 
    description: 'Tanggal dan waktu mulai pemesanan (format ISO 8601)' 
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    example: '2026-02-12T17:00:00Z', 
    description: 'Tanggal dan waktu selesai pemesanan (format ISO 8601)' 
  })
  @IsDateString()
  endDate: string;
}
