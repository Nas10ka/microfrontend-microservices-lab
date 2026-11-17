import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validateEnvironment } from './config/environment';
import { EventsModule } from './modules/events/events.module';
import { BookingsModule } from './modules/bookings/bookings.module';

// Load and validate .env before deciding whether to enable MongoDB.
const configModule = ConfigModule.forRoot({
  isGlobal: true,
  validate: validateEnvironment,
});

const databaseImports = process.env.MONGO_ENABLED === 'true'
  ? [MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI'),
      }),
    })]
  : [];

@Module({
  imports: [configModule, ...databaseImports, EventsModule, BookingsModule],
})
export class AppModule {}
