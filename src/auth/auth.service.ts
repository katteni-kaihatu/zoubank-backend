import {Get, Injectable} from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor() {}

    test() {
        return 'Hello World!';
    }
}

