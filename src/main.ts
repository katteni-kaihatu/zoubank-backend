import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as session from 'express-session';
import * as process from "node:process";

async function bootstrap() {
    if (!process.env.SESSION_SECRET) {
        throw new Error("SESSION_SECRET is not found.")
    }

    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.use(
        session({
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
