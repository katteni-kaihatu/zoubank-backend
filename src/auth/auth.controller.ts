import {Controller, Get, Post, Req} from '@nestjs/common';
import { Request } from 'express'

@Controller('auth')
export class AuthController {

    @Get()
    getHello(): string {
        return 'Hello World!';
    }

    @Post("/")
    login(@Req() req: Request) {
        const authorizationHeader = req.header("Authorization")
        return "login"
    }
}
