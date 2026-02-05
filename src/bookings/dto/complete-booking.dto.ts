import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CompleteBookingDto {
  @ApiProperty({ example: 75.5, description: 'Fuel level at end (liters or %)' })
  @IsNumber()
  @IsPositive()
  fuelEnd: number;

  @ApiProperty({ example: 150.5, description: 'Distance traveled in km' })
  @IsNumber()
  @IsPositive()
  distanceKm: number;
}
