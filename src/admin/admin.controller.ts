import {Body, Controller, Post, Headers, HttpException} from '@nestjs/common';
import {Prisma, User} from "@prisma/client";
import {JwtService} from "../jwt/jwt.service";
import {UserService} from "../user/user.service";
import bcrypt from "bcrypt"

@Controller('admin')
export class AdminController {

    constructor(private readonly userService: UserService) {
    }

    @Post("/user")
    async createUser(@Headers("Authorization") authHeader: string, @Body() data: Partial<User>) {
        const APIToken = authHeader?.split("Bearer ")[1]
        if (!APIToken) {
            throw new HttpException("Unauthorized", 401)
        }
        const APITokenHash = await bcrypt.hash(APIToken, 10)
        const adminUser = await this.userService.findUserByAPITokenHash(APITokenHash)
        if (!adminUser) {
            throw new HttpException("Unauthorized", 401)
        }
        if (adminUser.role !== "ADMIN") {
            throw new HttpException("Unauthorized", 401)
        }

        // resoniteUserIdとroleは必須
        if (!data.resoniteUserId || !data.role) {
            throw new HttpException("Bad Request", 400)
        }

        const newApiTokenRaw = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const newApiTokenHash = await bcrypt.hash(newApiTokenRaw, 10)

        const newUser = await this.userService.createUserAdmin({
            resoniteUserId: data.resoniteUserId,
            role: data.role,
            APITokenHash: newApiTokenHash,
            branchName: data.branchName ?? "本店",
            accountNumber: data.accountNumber ?? Math.floor(1000000 + Math.random() * 9000000).toString(),
            balance: new Prisma.Decimal(0),
        })
        return { ...newUser, ApiToken: newApiTokenRaw }
    }
}
