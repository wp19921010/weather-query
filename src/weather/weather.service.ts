import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CityMappingService } from './city-mapping.service';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private configService: ConfigService,
    private cityMappingService: CityMappingService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY', '');
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    if (!city || city.trim().length === 0) {
      throw new HttpException(
        'City name is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.apiKey) {
      throw new HttpException(
        'Weather API key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // 将中文城市名转换为英文名
    const cityEnglish = this.cityMappingService.getCityEnglishName(city);

    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          q: cityEnglish,
          appid: this.apiKey,
          units: 'metric', // 使用摄氏度
          lang: 'zh_cn', // 中文描述
        },
      });

      const data = response.data;

      return {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMsg = error.response?.data?.message;

        // 处理城市未找到的情况
        if (status === 404 || errorMsg?.includes('city not found')) {
          throw new HttpException(
            `City "${city}" not found. Please check the city name and try again.`,
            HttpStatus.NOT_FOUND,
          );
        }

        // 处理 API Key 无效
        if (status === 401 || errorMsg?.includes('Invalid API')) {
          throw new HttpException(
            'Weather API key is invalid or expired',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const message = errorMsg || error.message || 'Failed to fetch weather data';
        throw new HttpException(message, status || HttpStatus.BAD_GATEWAY);
      }
      throw new HttpException(
        `Failed to fetch weather for ${city}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<WeatherData> {
    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
      throw new HttpException(
        'Latitude and longitude are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.apiKey) {
      throw new HttpException(
        'Weather API key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          lang: 'zh_cn',
        },
      });

      const data = response.data;

      return {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || HttpStatus.BAD_GATEWAY;
        const message =
          error.response?.data?.message || error.message || 'Failed to fetch weather data';
        throw new HttpException(message, status);
      }
      throw new HttpException(
        `Failed to fetch weather for coordinates: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
