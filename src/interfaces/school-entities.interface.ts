export enum RolesEnum {
  BURSAR = 'bursar',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface SchoolAttributeI {
  name: string;
  email: string;
  address: string;
  contact: string;
  logoUrl: string;
}

export interface AdminInfoAttributeI {
  name: string;
  profile: string;
  profileImageUrl: string;
}

export interface SubjectAttributeI {
  name: string;
}

export interface ClassroomAttributesI {
  schoolId: number;
  name: string;
  level: string;
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export interface StudentAttributesI {
  schoolId: number;
  surname: string;
  firstName: string;
  middleName: string;
  dateOfBirth: Date;
  classId: number;
  gender: GenderEnum;
  admissionNumber: number;
  email: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  passportUrl: string;
  password: string;
}

export interface TermAttributeI {
  schoolId: number;
  term: number;
  name: string;
}

export interface StudentReportAttributeI {
  schoolId: number;
  termId: number;
  studentId: number;
  classId: number;
  vacatesOn: Date;
  resumesOn: Date;
  noOfTimesSchoolOPened: number;
  noOfTimesPresent: number;
  noOfTimesAbsent: number;
  totalObtainable: number;
  totalScore: number;
  studentAverage: number;
  classAverage: number;
  yearAverage: number;
  classPosition: number;
}

export interface StaffAttributeI {
  schoolId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  classId: string;
  gender: GenderEnum;
  password: string;
  employeeNumber: string;
  specialization: string;
  dateOfBirth: Date;
  passportUrl: string;
  isActive: boolean;
}

export interface RoleAttributeI {
  schoolId: number;
  staffId: number;
  name: RolesEnum;
}

export interface TeacherSubjects {
  schoolId: number;
  staffId: number;
  subjectId: number;
}

export interface classSubjects {
  subjectId: string;
  classId: string;
}

export interface studentSubjectScores {
  reportId: number;
  subjectId: number;
  studentId: number;
  contAssessment: number;
  examScore: number;
  grade: number;
  total: number;
  position: number;
  highest: number;
  lowest: number;
}

export interface GradeSystemAttributeI {
  schoolId: number;
  grade: string;
  upperRange: number;
  lowerRange: number;
}

export interface ScoreFormulaAttributeI {
  schoolId: number;
  examScore: number;
  numberOfAssessment: number;
  scorePerAssessment: number;
}
