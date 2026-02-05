import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Maintenance')
@ApiBearerAuth()
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Schedule a new maintenance' })
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance records' })
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming maintenance within specified days' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getUpcoming(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.maintenanceService.getUpcomingMaintenance(daysNum);
  }

  @Get('vehicle/:id')
  @ApiOperation({ summary: 'Get maintenance history for a vehicle' })
  getVehicleHistory(@Param('id') id: string) {
    return this.maintenanceService.getVehicleMaintenanceHistory(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get maintenance by ID' })
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(+id);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark maintenance as completed' })
  complete(
    @Param('id') id: string,
    @Body() body: { actualCost?: number; notes?: string },
  ) {
    return this.maintenanceService.complete(+id, body.actualCost, body.notes);
  }
}
