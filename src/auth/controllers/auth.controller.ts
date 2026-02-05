import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

/**
 * Controller untuk autentikasi pengguna
 * Menangani proses login dan pembuatan JWT token
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint untuk login pengguna
   * @param loginDto - Data username dan password pengguna
   * @returns Access token JWT untuk autentikasi
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login untuk Ambil access token' })
  @ApiResponse({ status: 200, description: 'Login berhasil, token JWT dikembalikan' })
  @ApiResponse({ status: 401, description: 'Username atau password salah' })
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
