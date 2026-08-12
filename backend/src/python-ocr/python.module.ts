import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PythonService } from './python.service';

@Module({
  imports: [HttpModule],
  providers: [PythonService],
  exports: [PythonService],
})
export class PythonModule {}