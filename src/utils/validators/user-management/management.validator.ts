import Joi, { ValidationResult } from 'joi';
import { Request } from 'express';
import { BaseValidator } from '@src/utils/validators';

class UserManagementValidatorUtil extends BaseValidator {
  public promoteStudent = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      studentId: Joi.number().required().label('Student ID'),
      classId: Joi.number().required().label('Class ID'),
    });

    return this.validate(schema, req.body);
  };
}

export default new UserManagementValidatorUtil();
