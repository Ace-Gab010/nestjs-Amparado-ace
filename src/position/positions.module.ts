import { Module } from '@nestjs/common';
import { PositionService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PositionsController],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionsModule {}