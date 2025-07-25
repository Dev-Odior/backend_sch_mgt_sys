import SystemError from '@src/errors/system.error';

export default class ConflictError extends SystemError {
  constructor(message: string) {
    super(409, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
