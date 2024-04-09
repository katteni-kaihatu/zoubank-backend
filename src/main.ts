import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as session from 'express-session';
import * as process from "node:process";

declare module 'express-session' {
    interface SessionData {
        user: any
    }
}


async function bootstrap() {
    if (!process.env.SESSION_SECRET) {
        throw new Error("SESSION_SECRET is not found.")
    }

    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: "http://localhost:3001",
        credentials: true,
    });

    app.use(
        session({
            name: "zoubank-session",
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            },
        }),
    );

    await app.listen(3000);
}

bootstrap();
