import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";

@Injectable()
export class UserService {

    constructor(private prismaService: PrismaService) {}

    getUserById(id: User["resoniteUserId"]) {
        return this.prismaService.user.findUnique({
            where: {id: id},
            include: {
                incomingTransfers: true,
                outgoingTransfers: true
            }
        })
    }

    getUserByResoniteUserId(resoniteUserId: User["resoniteUserId"]) {
        return this.prismaService.user.findUnique({
            where: {resoniteUserId: resoniteUserId}
        })
    }

    createUser(data: Pick<User, "resoniteUserId">) {
        return this.prismaService.user.create({
            data: {
                resoniteUserId: data.resoniteUserId,
                // 7桁のランダムな数字を文字列に変換してアカウント番号として設定
                accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
                branchName: "本店",
                role: "USER",
                balance: 0,
            }
        })
    }

    upsertUserByResoniteUserId(resoniteUserId: User["resoniteUserId"]) {
        // 既にユーザーが存在する場合は返す、存在しない場合は新規作成
        return this.prismaService.user.upsert({
            where: {resoniteUserId: resoniteUserId},
            update: {},
            create: {
                resoniteUserId: resoniteUserId,
                accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
                branchName: "本店",
                role: "USER",
                balance: 0,
            }
        })
    }

    updateUser(id: User["resoniteUserId"], data: Partial<User>) {
        return this.prismaService.user.update({
            where: {id: id},
            data: data
        })
    }
}
