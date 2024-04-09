import {Controller, Get, HttpException, Session} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}


    @Get("/")
    getUserInfo(@Session() session: Record<string, any>) {
        if(!session.user?.id) {
            throw new HttpException("Unauthorized", 401)
        }

        return this.userService.getUserById(session.user.id)
    }
}
