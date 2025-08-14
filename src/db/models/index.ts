import { Sequelize } from 'sequelize';

import ClassRoom, {
  init as initClassroom,
  associate as associateClassroom,
} from './school/class.model';

import Student, {
  init as initStudent,
  associate as associateStudent,
} from './student/student.model';

import StudentReport, {
  init as initStudentReport,
  associate as associateStudentReport,
} from './student/student-report.model';

import StudentSubjectScores, {
  init as initStudentSubjectScores,
  associate as associateStudentSubjectScores,
} from './student/student-score.model';

import School, { init as initSchool, associate as associateSchool } from './school/school.model';

import Role, { init as initRole, associate as associateRole } from './school/role.model';

import Staff, { init as initStaff, associate as associateStaff } from './school/staff.model';

import Term, { init as initTerm, associate as associateTerm } from './school/term.model';

import AcademicSession, {
  init as initAcademicSession,
  associate as associateAcademicSession,
} from './school/session.model';

import TeacherSubject, {
  init as initTeacherSubject,
  associate as associateTeacherSubject,
} from './school/teacher-subject.model';

import ScoreFormula, {
  init as initScoreFormula,
  associate as associateScoreFormula,
} from './school/score-formula.model';

import GradeSystem, {
  init as initGradeSystem,
  associate as associateGradeSystem,
} from './school/grade-system.model';

import Subject, {
  init as initSubject,
  associate as associateSubject,
} from './school/subject.model';

import ClassRoomSubject, {
  init as initClassRoomSubject,
  associate as associateClassroomSubject,
} from './school/class-subject.model';

import Admin, { init as initAdmin, associate as associateAdmin } from './school/admin.model';

import Activity, {
  init as initActivity,
  associate as associateActivity,
} from './audit/activity.model';

export {
  ClassRoom,
  ClassRoomSubject,
  Student,
  StudentReport,
  StudentSubjectScores,
  Role,
  School,
  Staff,
  Term,
  Subject,
  GradeSystem,
  ScoreFormula,
  TeacherSubject,
  Admin,
  AcademicSession,
  Activity,
};

function associate() {
  associateStudent();
  associateStudentSubjectScores();
  associateStudentReport();
  associateGradeSystem();
  associateScoreFormula();
  associateAdmin();
  associateActivity();
  associateAcademicSession();
  associateClassroomSubject();

  associateRole();
  associateSubject();
  associateSchool();
  associateClassroom();
  associateStaff();
  associateTerm();
  associateTeacherSubject();
}

export function init(connection: Sequelize) {
  initStudentReport(connection);
  initStudent(connection);
  initStudentSubjectScores(connection);
  initActivity(connection);
  initAcademicSession(connection);
  initClassRoomSubject(connection);

  initClassroom(connection);
  initRole(connection);
  initSchool(connection);
  initStaff(connection);
  initTerm(connection);
  initSubject(connection);
  initGradeSystem(connection);
  initScoreFormula(connection);
  initTeacherSubject(connection);
  initAdmin(connection);

  associate();
}
