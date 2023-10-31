import { Module } from '@nestjs/common';
import { ExplorerConfig } from './explorer.config';
import { ExplorerService } from './explorer.service';

@Module({
  providers: [ExplorerConfig, ExplorerService],
  exports: [ExplorerService],
})
export class ExplorerModule {}
