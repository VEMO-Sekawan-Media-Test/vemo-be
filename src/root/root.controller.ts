import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Root Controller - Health Check Endpoint
 * Digunakan untuk memverifikasi bahwa aplikasi berjalan dengan baik
 */
@ApiTags('Health')
@Controller()
export class RootController {

  /**
   * Health check endpoint untuk memverifikasi aplikasi berjalan
   * @returns Status kesehatan aplikasi
   */
  @Get()
  @ApiOperation({ summary: 'Health check - Memeriksa status aplikasi' })
  @ApiResponse({ status: 200, description: 'Aplikasi berjalan dengan baik', schema: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ok' },
      timestamp: { type: 'string', example: '2026-02-05T05:27:00.000Z' },
      service: { type: 'string', example: 'VEMO - Vehicle Monitoring & Booking System' }
    }
  }})
  getHealth(): { status: string; timestamp: string; service: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'VEMO - Vehicle Monitoring & Booking System'
    };
  }

  /**
   * Informasi detail tentang API
   * @returns Informasi API dan link dokumentasi
   */
  @Get('info')
  @ApiOperation({ summary: 'Informasi tentang API' })
  @ApiResponse({ status: 200, description: 'Informasi API berhasil diambil', schema: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'VEMO API' },
      version: { type: 'string', example: '1.0.0' },
      description: { type: 'string', example: 'Vehicle Monitoring & Booking System API' },
      documentation: { type: 'string', example: 'http://localhost:3000/api' }
    }
  }})
  getInfo(): { name: string; version: string; description: string; documentation: string } {
    return {
      name: 'VEMO API',
      version: '1.0.0',
      description: 'Vehicle Monitoring & Booking System API untuk perusahaan pertambangan nikel',
      documentation: '/api'
    };
  }
}
