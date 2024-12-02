import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';

@Module({
  controllers: [ReceiptsController],
  providers: []
})
export class ReceiptsModule {}
