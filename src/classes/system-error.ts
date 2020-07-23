export class SystemError<T> extends Error {
    constructor(readonly code: T, message: string, ... params: any) {
        super(message);
    }
}
