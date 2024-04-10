import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";

@Injectable()
export class TransactionService {
    constructor(private readonly prismaService: PrismaService) {
    }


    async createTransaction(fromUser: Pick<User, "id">,
                      toUser: Pick<User, "id">,
                      amount: number,
                      externalData?: any
    ) {
        // トランザクションで処理する

        // 送金元の残高を減らす
        // 送金先の残高を増やす
        // 送金履歴を記録する

        const retult = await this.prismaService.$transaction([
            this.prismaService.user.update({
                where: {id: fromUser.id},
                data: {balance: {decrement: amount}}
            }),
            this.prismaService.user.update({
                where: {id: toUser.id},
                data: {balance: {increment: amount}}
            }),
            this.prismaService.transaction.create({
                data: {
                    amount: amount,
                    sender: {connect: {id: fromUser.id}},
                    recipient: {connect: {id: toUser.id}},
                    externalData: externalData
                }
            })
        ])

        if(retult) {
            return true
        }
        return false
    }
}
