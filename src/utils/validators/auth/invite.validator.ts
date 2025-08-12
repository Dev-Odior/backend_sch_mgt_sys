import Joi, { ValidationResult } from 'joi';
import { Request } from 'express';
import { BaseValidator } from '@src/utils/validators';

class InviteValidatorUtil extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      email: Joi.string().email().required().label('Email'),
      lastName: Joi.string().required().label('Last Name'),
      firstName: Joi.string().required().label('First Name'),
      phoneNumber: Joi.string().pattern(this.patterns.phoneNumber).label('Phone Number'),
    });

    return this.validate(schema, req.body);
  };

  public verify = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      firstName: Joi.string().required().label('First Name'),
      lastName: Joi.string().required().label('Last Name'),
      phoneNumber: Joi.string().pattern(this.patterns.phoneNumber).label('Phone Number'),
      password: Joi.string().required().label('Password'),
      confirmPassword: Joi.ref('password'),
    });

    return this.validate(schema, req.body);
  };
}

export default new InviteValidatorUtil();
