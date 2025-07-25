import SystemError from '@src/errors/system.error';

export default class UnauthorizedError extends SystemError {
  constructor(message?: string) {
    super(401, message || 'You are not authorized to access this resource.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
