import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService],
  exports:[DatabaseService] //export makes the service to be exported and injected elsewhere
})
export class DatabaseModule {}
