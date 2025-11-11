import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { WeatherService, WeatherData } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('city')
  async getWeatherByCity(@Query('name') cityName: string): Promise<WeatherData> {
    if (!cityName) {
      throw new HttpException(
        'City name is required. Please provide ?name=cityname',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.weatherService.getCurrentWeather(cityName);
  }

  @Get('coordinates')
  async getWeatherByCoordinates(
    @Query('lat') latitude: string,
    @Query('lon') longitude: string,
  ): Promise<WeatherData> {
    if (!latitude || !longitude) {
      throw new HttpException(
        'Latitude and longitude are required. Please provide ?lat=value&lon=value',
        HttpStatus.BAD_REQUEST,
      );
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      throw new HttpException(
        'Latitude and longitude must be valid numbers',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.weatherService.getWeatherByCoordinates(lat, lon);
  }

  @Get('default')
  async getDefaultWeather(): Promise<WeatherData> {
    return this.weatherService.getCurrentWeather('Beijing');
  }
}
