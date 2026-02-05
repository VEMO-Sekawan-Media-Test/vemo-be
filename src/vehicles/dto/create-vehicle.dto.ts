import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota HiAce' })
  @IsString()
  @IsNotEmpty()
  modelName: string;

  @ApiProperty({ example: 'B 1234 XYZ' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ example: 'Personnel', enum: ['Personnel', 'Freight'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Company', enum: ['Company', 'Rental'] })
  @IsString()
  @IsNotEmpty()
  ownership: string;

  @ApiProperty({ example: 'Kantor Pusat', description: 'Location: Kantor Pusat, Cabang, Tambang 1-6' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 0.12, description: 'Fuel consumption in liters per km' })
  @IsNumber()
  fuelConsumption: number;

  @ApiProperty({ example: '2026-01-15T00:00:00Z', required: false })
  @IsOptional()
  lastService?: string | Date;
}
