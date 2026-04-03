import { Module } from '@nestjs/common'
import { CContainerService } from './c-container.service'
import { CContainerController } from './c-container.controller'
import { AuthModule } from 'src/auth/auth.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [AuthModule, ScheduleModule.forRoot()],
  providers: [CContainerService],
  controllers: [CContainerController],
})
export class CContainerModule {}
