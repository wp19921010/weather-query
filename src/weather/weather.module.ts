import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CityMappingService } from './city-mapping.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, CityMappingService],
})
export class WeatherModule {}
