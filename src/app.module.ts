import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PositionsModule } from './position/positions.module';

@Module({
    imports : [ DatabaseModule, PositionsModule, AuthModule, UsersModule],
})  
export class AppModule {}