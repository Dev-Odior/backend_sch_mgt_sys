import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import Student from './student.model';
import Classroom from '../school/class.model';
import Term from '../school/term.model';

export interface StudentReportAttributeI {
  id: CreationOptional<number>;
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

class StudentReport
  extends Model<InferAttributes<StudentReport>, InferCreationAttributes<StudentReport>>
  implements StudentReportAttributeI
{
  declare id: CreationOptional<number>;
  declare termId: number;
  declare studentId: number;
  declare classId: number;
  declare vacatesOn: Date;
  declare resumesOn: Date;
  declare noOfTimesSchoolOPened: number;
  declare noOfTimesPresent: number;
  declare noOfTimesAbsent: number;
  declare totalObtainable: number;
  declare totalScore: number;
  declare studentAverage: number;
  declare classAverage: number;
  declare yearAverage: number;
  declare classPosition: number;
}

export function init(connection: Sequelize) {
  StudentReport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vacatesOn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      resumesOn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      noOfTimesSchoolOPened: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      noOfTimesPresent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      noOfTimesAbsent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalObtainable: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      studentAverage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      classAverage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      yearAverage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      classPosition: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'student_report',
      timestamps: true,
    },
  );
}

export function associate() {
  StudentReport.belongsTo(Term, {
    foreignKey: 'termId',
    as: 'term',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  StudentReport.belongsTo(Student, {
    foreignKey: 'studentId',
    as: 'student',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  StudentReport.belongsTo(Classroom, {
    foreignKey: 'classId',
    as: 'classroom',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
}

export default StudentReport;
