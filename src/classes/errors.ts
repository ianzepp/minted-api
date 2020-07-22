export class SystemError<T> extends Error {
    constructor(readonly code: T, message: string, ... params: any) {
        super(message);
    }
}

export class Error400 extends SystemError<400> {};
export class Error404 extends SystemError<404> {};
export class Error500 extends SystemError<500> {};
