import SystemError from '@src/errors/system.error';

export default class NotFoundError extends SystemError {
  constructor(message?: string) {
    super(404, message || 'Resource not found.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
