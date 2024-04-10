import {Controller, Post, Session, Headers, Body, HttpException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {SessionData} from "express-session";
import {User} from "@prisma/client";
import {TransactionService} from "./transaction.service";

@Controller('transaction')
export class TransactionController {

    constructor(private readonly userService: UserService,
                private readonly transactionService: TransactionService) {
    }

    @Post("/")
    async createTransaction(@Session() session: SessionData,
                            @Headers("Authorization") authHeader: string,
                            @Body() data: any) {
        // TODO: サービスに移動するべき
        // セッションを持っているか、APIトークンを持っているかを確認
        const APIToken = authHeader?.split("Bearer ")[1]
        if (!APIToken && !session.user?.id) {
            throw new HttpException("Unauthorized", 401)
        }
        const sessionUser: User = session.user
        const apiUser = await this.userService.findUserByAPITokenHash(APIToken)

        // どちらかのユーザーが存在しない場合はエラー
        if (!sessionUser && !apiUser) {
            throw new HttpException("Unauthorized", 401)
        }

        const user = sessionUser || apiUser

        const fromUserId = data.senderId
        const toUserId = data.recipientId
        const amount = data.amount

        if (!fromUserId || !toUserId || !amount) {
            throw new HttpException("Bad Request", 400)
        }

        // マイナスの金額は送金できない
        if (amount < 0) {
            throw new HttpException("Bad Request", 400)
        }

        // 送金元と送金先が同じユーザーの場合はエラー
        if (fromUserId === toUserId) {
            throw new HttpException("Bad Request", 400)
        }

        // ADMINユーザー以外は自分のアカウントからの送金のみ可能
        if (user.role !== "ADMIN" && user.id !== fromUserId) {
            throw new HttpException("Bad Request", 400)
        }

        // User取得
        const fromUser = await this.userService.getUserByResoniteUserId(fromUserId)
        const toUser = await this.userService.getUserByResoniteUserId(toUserId)

        // 送金元の残高が足りない場合はエラー
        if (fromUser.balance < amount) {
            throw new HttpException("Not Enough Balance", 400)
        }

        const result = await this.transactionService.createTransaction(fromUser, toUser, amount)
        if(!result) {
            throw new HttpException("Failed to create transaction", 500)
        }

        return {message: "Transaction completed"}
    }
}
