import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  vehicleId: number;

  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  driverName: string;

  @ApiProperty({ example: 2 }) // ID Atasan Level 1
  @IsInt()
  approver1Id: number;

  @ApiProperty({ example: 3 }) // ID Atasan Level 2
  @IsInt()
  approver2Id: number;

  @ApiProperty({ example: '2026-02-10T08:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-02-12T17:00:00Z' })
  @IsDateString()
  endDate: string;
}
