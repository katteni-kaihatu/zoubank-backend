import {Body, Controller, Get, HttpException, Put, Session} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "@prisma/client";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }


    @Get("/")
    getUserInfo(@Session() session: Record<string, any>) {
        if (!session.user?.id) {
            throw new HttpException("Unauthorized", 401)
        }

        return this.userService.getUserById(session.user.id)
    }

    @Put("/")
    updateUser(@Session() session: Record<string, any>,@Body() data: Pick<User, "accountNumber" | "branchName">) {
        if (!session.user?.id) {
            throw new HttpException("Unauthorized", 401)
        }

        return this.userService.updateUser(session.user.id, data)
    }
}
