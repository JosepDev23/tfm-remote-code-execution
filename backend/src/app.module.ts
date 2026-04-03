import { Module } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'
import { MaudeContainerModule } from './maude-container/maude-container.module'
import { CContainerModule } from './c-container/c-container.module'
import { JsContainerModule } from './js-container/js-container.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [SwaggerModule, MaudeContainerModule, CContainerModule, JsContainerModule, AuthModule],
})
export class AppModule {}
