import { Module } from '@nestjs/common'
import { JsContainerService } from './js-container.service'
import { JsContainerController } from './js-container.controller'
import { AuthModule } from 'src/auth/auth.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [AuthModule, ScheduleModule.forRoot()],
  providers: [JsContainerService],
  controllers: [JsContainerController],
})
export class JsContainerModule {}
