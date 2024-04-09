import {Module} from '@nestjs/common';
import {JwtService} from './jwt/jwt.service';
import {AuthService} from './auth/auth.service';
import {UserService} from './user/user.service';
import {PrismaService} from './prisma/prisma.service';

import {AuthController} from './auth/auth.controller';
import {UserController} from './user/user.controller';

@Module({
    imports: [],
    controllers: [UserController, AuthController],
    providers: [PrismaService, AuthService, JwtService, UserService],
})
export class AppModule {
}
