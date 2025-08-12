import Joi, { ValidationResult } from 'joi';
import { Request } from 'express';
import { BaseValidator } from '@src/utils/validators';
import { GenderEnum, RolesEnum } from '@src/interfaces/school-entities.interface';

class AdminAuthValidatorUtil extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      name: Joi.string().required().label('Name'),
      email: Joi.string().email().required().label('Email'),
      password: Joi.string().required().label('Password'),
      address: Joi.string().required().label('Address'),
      contact: Joi.string().required().label('Contact'),
      logoUrl: Joi.string().required().label('Logo URL'),
    });

    return this.validate(schema, req.body);
  };

  public update = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      name: Joi.string().optional().label('Name'),
      email: Joi.string().email().optional().label('Email'),
      address: Joi.string().optional().label('Address'),
      adminName: Joi.string().optional().label('Admin Name'),
      adminProfileUrl: Joi.string().optional().label('Profile url'),
    });

    return this.validate(schema, req.body);
  };

  public createStudent = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      schoolId: Joi.number().required().label('School ID'),
      surname: Joi.string().required().label('Surname'),
      firstName: Joi.string().required().label('First Name'),
      middleName: Joi.string().required().label('Middle Name'),
      dateOfBirth: Joi.date().required().label('Date of Birth'),
      classId: Joi.number().required().label('Class ID'),
      gender: Joi.string()
        .valid(...Object.values(GenderEnum))
        .required()
        .label('Gender'),
      admissionNumber: Joi.number().required().label('Admission Number'),
      email: Joi.string().email().required().label('Email'),
      guardianName: Joi.string().required().label('Guardian Name'),
      guardianPhone: Joi.string().required().label('Guardian Phone'),
      address: Joi.string().required().label('Address'),
      passportUrl: Joi.string().required().label('Passport URL'),
      password: Joi.string().required().label('Password'),
    });

    return this.validate(schema, req.body);
  };

  public createStaff = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      schoolId: Joi.number().required().label('School ID'),
      fullName: Joi.string().required().label('Full Name'),
      email: Joi.string().email().required().label('Email'),
      phoneNumber: Joi.string().required().label('Phone Number'),
      subjects: Joi.array().items(Joi.number()).required().label('Subjects'),
      classId: Joi.number().required().label('Class ID'),
      gender: Joi.string()
        .required()
        .valid(...Object.values(GenderEnum))
        .label('Gender'),
      role: Joi.string()
        .required()
        .valid(...Object.values(RolesEnum))
        .label('Role'),
      password: Joi.string().required().label('Password'),
      employeeNumber: Joi.string().required().label('Employee Number'),
      specialization: Joi.string().required().label('Specialization'),
      dateOfBirth: Joi.date().required().label('Date of Birth'),
      passportUrl: Joi.string().required().label('Passport URL'),
    });

    return this.validate(schema, req.body);
  };

  public assignRole = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      schoolId: Joi.number().required().label('School ID'),
      staffId: Joi.number().required().label('Staff ID'),
      roleId: Joi.number().required().label('Role ID'),
    });

    return this.validate(schema, req.body);
  };

  public createGradeSystem = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      schoolId: Joi.number().required().label('School ID'),
      grade: Joi.string().required().label('Grade'),
      upperRange: Joi.number().required().label('Upper Range'),
      lowerRange: Joi.number().required().label('Lower Range'),
    });

    return this.validate(schema, req.body);
  };

  public createScoreFormula = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      schoolId: Joi.number().required().label('School ID'),
      examScore: Joi.number().required().label('Exam Score'),
      numberOfAssessment: Joi.number().required().label('Number of Assessment'),
      scorePerAssessment: Joi.number().required().label('Score Per Assessment'),
    });

    return this.validate(schema, req.body);
  };

  public changePassword = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      password: Joi.string().required().label('Password'),
      newPassword: Joi.string().required().label('New Password'),
      confirmPassword: Joi.ref('newPassword'),
    });

    return this.validate(schema, req.body);
  };
}

export default new AdminAuthValidatorUtil();
