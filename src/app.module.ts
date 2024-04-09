import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [JwtService, AuthService, UserService, PrismaService],
})
export class AppModule {}
