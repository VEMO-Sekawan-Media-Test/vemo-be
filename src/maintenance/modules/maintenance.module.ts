import { Module } from '@nestjs/common';
import { MaintenanceService } from '../services/maintenance.service';
import { MaintenanceController } from '../controllers/maintenance.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
