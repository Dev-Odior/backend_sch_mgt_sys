import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import StudentReport from './student-report.model';
import Student from './student.model';
import Subject from '../school/subject.model';

export interface StudentSubjectScoresI {
  id: CreationOptional<number>;
  subjectId: number;
  studentId: number;
  termId: number;
  contAssessment: number;
  examScore: number;
  grade: string;
  total: number;
}

class StudentSubjectScores
  extends Model<
    InferAttributes<StudentSubjectScores>,
    InferCreationAttributes<StudentSubjectScores>
  >
  implements StudentSubjectScoresI
{
  declare id: CreationOptional<number>;
  declare subjectId: number;
  declare studentId: number;
  declare termId: number;
  declare classId: number;
  declare contAssessment: number;
  declare examScore: number;
  declare grade: string;
  declare total: number;
}

export function init(connection: Sequelize) {
  StudentSubjectScores.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contAssessment: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      examScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize: connection,
      tableName: 'student_subject_scores',
      timestamps: true,
    },
  );
}

export function associate() {
  StudentSubjectScores.belongsTo(StudentReport, {
    foreignKey: 'reportId',
    as: 'report',
    onDelete: 'CASCADE',
  });

  StudentSubjectScores.belongsTo(Subject, {
    foreignKey: 'subjectId',
    as: 'subject',
    onDelete: 'CASCADE',
  });

  StudentSubjectScores.belongsTo(Student, {
    foreignKey: 'studentId',
    as: 'student',
    onDelete: 'CASCADE',
  });
}

export default StudentSubjectScores;
