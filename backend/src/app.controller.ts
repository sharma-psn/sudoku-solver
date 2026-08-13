import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  [x: string]: any;
  constructor(private readonly appService: AppService) {}

  @Get()
  sudokuApp(): string {
    return this.appService.sudokuApp();
  }

  @Get('health')
  async health() {
    const pythonHealth = await this.pythonService.checkHealth();
    if (pythonHealth.status !== 'ok') {
      return {
        status: 'error',
        message: 'Python service is unavailable',
      };
    }
    return {
      status: 'ok',
      service: 'NestJS Backend',
      timestamp: new Date().toISOString(),
    };
  }
}
