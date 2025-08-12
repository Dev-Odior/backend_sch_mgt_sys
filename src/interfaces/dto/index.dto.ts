import {
  Staff,
  Student,
  GradeSystem,
  ScoreFormula,
  StudentSubjectScores,
  Term,
} from '@src/db/models';

export interface StaffCreationDTO extends Omit<Staff, 'isActive'> {
  subjectIds?: number[];
}

export interface StudentCreationDTO extends Omit<Student, 'isActive'> {}

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

export interface TermDTO extends Omit<Term, 'id'> {}
