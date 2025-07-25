import Joi, { ValidationResult } from 'joi';
import { Request } from 'express';
import { BaseValidator } from '@src/utils/validators';

class UserValidatorUtil extends BaseValidator {
  public bulkCreate = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      firstName: Joi.string().required().label('First Name'),
      lastName: Joi.string().required().label('Last Name'),
      phoneNumber: Joi.string().label('Phone Number'),
      email: Joi.string().email().required().label('Email'),
    });

    return this.validate(schema, req.body);
  };

  public update = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      firstName: Joi.string().label('Email'),
      lastName: Joi.string().label('Password'),
      phoneNumber: Joi.string().label('Phone Number'),
    });

    return this.validate(schema, req.body);
  };

  public verifyPassword = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      password: Joi.string().required().label('Password'),
      confirmPassword: Joi.ref('password'),
    });

    return this.validate(schema, req.body);
  };
}

export default new UserValidatorUtil();
