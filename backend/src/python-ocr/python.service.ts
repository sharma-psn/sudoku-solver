import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class PythonService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async checkHealth() {
    const pythonUrl = this.configService.get<string>('PYTHON_SERVICE_URL');

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${pythonUrl}/health`),
      );

      return {
        status: 'ok',
        ...response.data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Python service is unavailable',
      };
    }
  }

  async extractGrid(
    file: any,
    rows: number,
    cols: number,
  ) {
    const pythonUrl = this.configService.get<string>('PYTHON_SERVICE_URL');

    const formData = new FormData();

    formData.append('image', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    formData.append('rows', rows.toString());
    formData.append('cols', cols.toString());

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${pythonUrl}/sudoku/extract-grid`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );
      return response.data;
    } 
    catch (error) {
      throw new InternalServerErrorException(
        error
      );
    }
  }
}