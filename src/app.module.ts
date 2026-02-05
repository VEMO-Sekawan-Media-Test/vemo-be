import { Module } from '@nestjs/common';
import { RootController } from './root/root.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/modules/auth.module';
import { VehiclesModule } from './vehicles/modules/vehicles.module';
import { BookingsModule } from './bookings/modules/bookings.module';
import { ReportsModule } from './reports/modules/reports.module';
import { MaintenanceModule } from './maintenance/modules/maintenance.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    VehiclesModule,
    BookingsModule,
    ReportsModule,
    MaintenanceModule,
  ],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
