import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateMaintenanceDto {
  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  @IsNumber()
  vehicleId: number;

  @ApiProperty({ example: 'Service rutin mingguan' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-02-20T09:00:00Z', description: 'Scheduled maintenance date' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ example: 1500000, description: 'Estimated cost in IDR' })
  @IsNumber()
  estimatedCost: number;

  @ApiProperty({ example: 'Engine Oil', required: false })
  @IsOptional()
  @IsString()
  serviceType?: string;
}
