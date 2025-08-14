import {
  Staff,
  Student,
  GradeSystem,
  ScoreFormula,
  StudentSubjectScores,
  Term,
  AcademicSession,
  Activity,
} from '@src/db/models';
import { UserRoleEnum } from '@src/db/models/school/staff.model';
import { Request } from 'express';

export interface StaffCreationDTO extends Omit<Staff, 'isActive'> {
  subjectIds?: number[];
}

export interface StudentCreationDTO extends Omit<Student, 'isActive'> {
  termId: number;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface GradeSystemDTO extends Omit<GradeSystem, 'id'> {}

export interface ScoreFormulaDTO extends Omit<ScoreFormula, 'id'> {}

export interface StudentScorePerSubjectDTO extends Omit<StudentSubjectScores, 'id'> {
  assessmentScores: number[];
}

export interface StudentScoreBulkCreation {
  termId: string;
}

export interface TermDTO extends Omit<Term, 'id'> {}

export interface UserForLoginDTO {
  email: string;
  password: string;
  role: UserRoleEnum;
}

export interface CreateAcademicSessionDTO extends Omit<AcademicSession, 'id'> {}

export interface PromoteStudentDTO {
  studentId: number;
  classId: number;
}

export interface SchoolCreationDTO {
  schoolName: string;
  schoolAddress: string;
  email: string;
  contactNumber: string;
  academicSessionName: string;
  numberOfTerms: number;
  termStartDate: Date;
  termEndDate: Date;
  logoUrl: string;
}

export interface CreateFormulaDTO {
  examScore: number;
  numberOfAssessment: number;
  assessmentScore: number;
}

export interface BulkClassSubjectDTO {
  termId: number;
  classId: number;
  subjectIds: number[];
}

export interface ClassSubjectDTO {
  termId: number;
  classId: number;
  subjectId: number;
}

export enum ActivityTypeEnum {
  createScore = 'create',
  updateScore = 'update',
  deleteScore = 'delete',
  generateReceipt = 'receipt',
}

export interface CreateActivityDTO extends Omit<Activity, 'id'> {
  req: Request;
  activityOn: number;
  activityType: ActivityTypeEnum;
}

export interface GenerateReportDTO {
  studentId: number;
  termId: number;
  classId: number;
}
