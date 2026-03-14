import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/client';
import { envs } from './config/envs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('OrdersService');
  constructor() {
    const pool = new Pool({ connectionString: envs.databaseUrl });
    const adapter = new PrismaPg(pool as any);
    super({ adapter });
  }

  async onModuleInit() {
    this.logger.log('Base de datos conectada');
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Base de datos desconectada');
    await this.$disconnect();
  }
}
