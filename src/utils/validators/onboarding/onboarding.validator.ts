import Joi, { ValidationResult } from 'joi';
import { Request } from 'express';
import { BaseValidator } from '@src/utils/validators';

class OnboardingValidatorUtil extends BaseValidator {
  public academicSession = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({});

    return this.validate(schema, req.body);
  };

  // TODO: ENUM OF TERM NAMES
  public schoolCreation = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      schoolName: Joi.string().required().label('School Name'),
      schoolAddress: Joi.string().required().label('School Address'),
      email: Joi.string().email().required().label('Email'),
      contactNumber: Joi.string().required().label('Contact Number'),
      academicSessionName: Joi.string().required().label('Academic Session Name '),
      numberOfTerms: Joi.number().required().label('Number of Terms'),
      termStartDate: Joi.date().required().label('Term Start Date '),
      termEndDate: Joi.date().required().label('Term End Date'),
      logoUrl: Joi.string().required().label('Logo Url'),
    });

    return this.validate(schema, req.body);
  };

  public formula = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      examScore: Joi.number().required().label('Exam Score'),
      numberOfAssessment: Joi.number().required().label('Number of Assessment'),
      assessmentScore: Joi.number().required().label('Assessment Score'),
    });

    return this.validate(schema, req.body);
  };

  public gradingSystem = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({});

    return this.validate(schema, req.body);
  };
}

export default new OnboardingValidatorUtil();
