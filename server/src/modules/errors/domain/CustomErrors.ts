export abstract class BaseDomainError extends Error {
    abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ValidationError extends BaseDomainError {
    readonly statusCode = 400;
}

export class UnauthorizedError extends BaseDomainError {
    readonly statusCode = 401;
}

export class ForbiddenError extends BaseDomainError {
    readonly statusCode = 403;
}

export class NotFoundError extends BaseDomainError {
    readonly statusCode = 404;
}

export class ConflictError extends BaseDomainError {
    readonly statusCode = 409;
}