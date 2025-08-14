import Joi, { ValidationResult } from 'joi';
import { Request } from 'express';
import { BaseValidator } from '@src/utils/validators';

class ClassSubjectValidatorUtil extends BaseValidator {
  public bulkCreate = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      termId: Joi.number().required().label('Term Id'),
      classId: Joi.string().required().label('Class Id'),
      subjectIds: Joi.array().items(Joi.number()).label('Subject IDs'),
    });

    return this.validate(schema, req.body);
  };

  public create = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      termId: Joi.number().required().label('Term Id'),
      classId: Joi.number().required().label('Class Id'),
      subjectId: Joi.number().required().label('Subject ID'),
    });

    return this.validate(schema, req.body);
  };
}

export default new ClassSubjectValidatorUtil();
