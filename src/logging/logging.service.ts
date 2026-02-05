import { Injectable, LoggerService } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  action: string;
  message: string;
  userId?: number;
  details?: Record<string, unknown>;
}

@Injectable()
export class LoggingService implements LoggerService {
  private logDir = join(process.cwd(), 'logs');
  private currentDate = new Date().toISOString().split('T')[0];

  constructor() {
    // Ensure logs directory exists
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLog(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString(),
    });
  }

  private writeToFile(logLine: string): void {
    const date = new Date().toISOString().split('T')[0];
    
    // Check if date changed
    if (date !== this.currentDate) {
      this.currentDate = date;
    }

    const logFile = join(this.logDir, `vemo-${date}.log`);
    writeFileSync(logFile, logLine + '\n', { flag: 'a' });
  }

  log(message: string, context?: string, details?: Record<string, unknown>, userId?: number) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: context || 'App',
      action: context || 'LOG',
      message,
      userId,
      details,
    };

    const logLine = this.formatLog(entry);
    console.log(`[INFO] ${message}`);
    this.writeToFile(logLine);
  }

  info(message: string, context?: string, details?: Record<string, unknown>, userId?: number) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: context || 'App',
      action: context || 'INFO',
      message,
      userId,
      details,
    };

    const logLine = this.formatLog(entry);
    console.log(`[INFO] ${message}`);
    this.writeToFile(logLine);
  }

  warn(message: string, context?: string, details?: Record<string, unknown>, userId?: number) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      service: context || 'App',
      action: context || 'WARN',
      message,
      userId,
      details,
    };

    const logLine = this.formatLog(entry);
    console.warn(`[WARN] ${message}`);
    this.writeToFile(logLine);
  }

  error(message: string, context?: string, details?: Record<string, unknown>, userId?: number) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      service: context || 'App',
      action: context || 'ERROR',
      message,
      userId,
      details,
    };

    const logLine = this.formatLog(entry);
    console.error(`[ERROR] ${message}`);
    this.writeToFile(logLine);
  }

  debug(message: string, context?: string, details?: Record<string, unknown>, userId?: number) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      service: context || 'App',
      action: context || 'DEBUG',
      message,
      userId,
      details,
    };

    const logLine = this.formatLog(entry);
    console.debug(`[DEBUG] ${message}`);
    this.writeToFile(logLine);
  }

  // Application-specific logging methods
  logUserAction(userId: number, action: string, message: string, details?: Record<string, unknown>) {
    this.info(message, 'UserAction', { ...details, action }, userId);
  }

  logBookingAction(userId: number, action: string, bookingId: number, details?: Record<string, unknown>) {
    this.info(`Booking ${action}: ID=${bookingId}`, 'BookingAction', { bookingId, action, ...details }, userId);
  }

  logVehicleAction(userId: number, action: string, vehicleId: number, details?: Record<string, unknown>) {
    this.info(`Vehicle ${action}: ID=${vehicleId}`, 'VehicleAction', { vehicleId, action, ...details }, userId);
  }

  logMaintenanceAction(userId: number, action: string, maintenanceId: number, details?: Record<string, unknown>) {
    this.info(`Maintenance ${action}: ID=${maintenanceId}`, 'MaintenanceAction', { maintenanceId, action, ...details }, userId);
  }

  logAuthAction(action: string, username: string, success: boolean, details?: Record<string, unknown>) {
    this.info(`Auth ${action}: ${username} (${success ? 'SUCCESS' : 'FAILED'})`, 'AuthAction', { username, action, success, ...details });
  }

  logSystemEvent(event: string, message: string, details?: Record<string, unknown>) {
    this.info(message, `System-${event}`, details);
  }
}
