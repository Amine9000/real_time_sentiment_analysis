import { Module } from '@nestjs/common';
import { EventsModule } from './gatewaysocket/EventsModule.module';

@Module({
  imports: [EventsModule],
})
export class AppModule {}
