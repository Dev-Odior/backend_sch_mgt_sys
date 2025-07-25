import SystemError from '@src/errors/system.error';

export default class BadRequestError extends SystemError {
  constructor(message?: string) {
    super(400, message || 'Bad Request');

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
