import Joi, { ValidationResult } from 'joi';
import { Request } from 'express';
import { BaseValidator } from '@src/utils/validators';

class StudentScoreValidatorUtil extends BaseValidator {
  public createScore = (req: Request): ValidationResult => {
    const schema = Joi.object({
      subjectId: Joi.number().required().label('Subject ID'),
      studentId: Joi.number().required().label('Student ID'),
      termId: Joi.number().required().label('Term ID'),
      contAssessment: Joi.number().required().label('Continuous Assessment'),
      examScore: Joi.number().required().label('Exam Score'),
      grade: Joi.string().required().label('Grade'),
      total: Joi.number().required().label('Total'),
    });

    return this.validate(schema, req.body);
  };
}

export default new StudentScoreValidatorUtil();
