import SystemError from '@src/errors/system.error';

export default class ApplicationError extends SystemError {
  constructor(code: number, message: string, errors?: Array<unknown>) {
    super(code, message, errors);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
