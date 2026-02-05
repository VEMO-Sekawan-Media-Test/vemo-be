import { Module } from '@nestjs/common';
import { RootController } from './root/root.controller';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingModule } from './logging/logging.module';
import { AuthModule } from './auth/modules/auth.module';
import { VehiclesModule } from './vehicles/modules/vehicles.module';
import { BookingsModule } from './bookings/modules/bookings.module';
import { ReportsModule } from './reports/modules/reports.module';
import { MaintenanceModule } from './maintenance/modules/maintenance.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    LoggingModule,
    AuthModule,
    VehiclesModule,
    BookingsModule,
    ReportsModule,
    MaintenanceModule,
    UsersModule,
  ],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
