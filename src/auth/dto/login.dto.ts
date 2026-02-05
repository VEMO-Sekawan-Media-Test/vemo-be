import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO untuk login pengguna
 * Berisi username dan password untuk autentikasi
 */
export class LoginDto {
  @ApiProperty({ 
    example: 'admin_vemo', 
    description: 'Username pengguna untuk login ke sistem' 
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Password pengguna untuk login ke sistem' 
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
