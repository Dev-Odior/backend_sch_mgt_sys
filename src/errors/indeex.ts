export type ErrorDetails = Record<string, unknown>;

export class SystemError extends Error {
  readonly code: number;

  readonly details?: ErrorDetails;

  constructor(
    code: number = 500,
    message: string = 'Sorry, something went wrong!',
    details?: ErrorDetails,
  ) {
    super(message);
    this.code = code;
    this.details = details;

    // Fix prototype chain once
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace for better debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Add a method to serialize the error for API responses
  toJSON(): object {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export class ApplicationError extends SystemError {
  constructor(code: number, message: string, details?: ErrorDetails) {
    super(code, message, details);
  }
}

export class NotFoundError extends SystemError {
  constructor(message: string = 'Resource not found.', details?: ErrorDetails) {
    super(404, message, details);
  }
}

export class ConflictError extends SystemError {
  constructor(message: string, details?: ErrorDetails) {
    super(409, message, details);
  }
}

export class UnauthorizedError extends SystemError {
  constructor(
    message: string = 'You are not authorized to access this resource.',
    details?: ErrorDetails,
  ) {
    super(401, message, details);
  }
}

export class BadRequestError extends SystemError {
  constructor(message: string = 'Bad Request!', details?: ErrorDetails) {
    super(400, message, details);
  }
}

export class ForbiddenError extends SystemError {
  constructor(message: string = 'Access Denied!', details?: ErrorDetails) {
    super(403, message, details);
  }
}

export class UnprocessableEntityError extends SystemError {
  constructor(message: string, details?: ErrorDetails) {
    super(422, message, details);
  }
}
