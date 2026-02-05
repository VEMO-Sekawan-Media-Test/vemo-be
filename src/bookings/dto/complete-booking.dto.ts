import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

/**
 * DTO untuk menyelesaikan pemesanan dengan data konsumsi BBM
 * Berisi informasi tentang BBM yang digunakan dan jarak tempuh
 */
export class CompleteBookingDto {
  @ApiProperty({ 
    example: 75.5, 
    description: 'Level BBM di akhir perjalanan (dalam liter atau persentase)' 
  })
  @IsNumber()
  @IsPositive()
  fuelEnd: number;

  @ApiProperty({ 
    example: 150.5, 
    description: 'Jarak tempuh perjalanan dalam kilometer' 
  })
  @IsNumber()
  @IsPositive()
  distanceKm: number;
}
