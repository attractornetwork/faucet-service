import { Injectable } from '@nestjs/common';
import { ExplorerConfig } from './explorer.config';

@Injectable()
export class ExplorerService {
  constructor(private config: ExplorerConfig) {}

  locateTransaction(hash: string): string {
    return `${this.config.baseUrl}tx/${hash}`;
  }
}
