import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
