import { Module } from '@nestjs/common';
import { VehiclesService } from '../services/vehicles.service';
import { VehiclesController } from '../controllers/vehicles.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
