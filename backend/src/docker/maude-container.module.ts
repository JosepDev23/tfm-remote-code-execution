import { Module } from '@nestjs/common'
import { MaudeContainerService } from './maude-container.service'
import { MaudeContainerController } from './maude-container.controller'
import { AuthModule } from 'src/auth/auth.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [AuthModule, ScheduleModule.forRoot()],
  providers: [MaudeContainerService],
  controllers: [MaudeContainerController],
})
export class MaudeContainerModule {}
