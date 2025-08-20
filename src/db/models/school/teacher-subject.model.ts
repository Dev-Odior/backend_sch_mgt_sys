import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import Staff from './staff.model';
import Subject from './subject.model';

export interface TeacherSubjects {
  id: CreationOptional<number>;
  staffId: number;
  subjectId: number;
}

class TeacherSubject
  extends Model<InferAttributes<TeacherSubject>, InferCreationAttributes<TeacherSubject>>
  implements TeacherSubjects
{
  declare id: CreationOptional<number>;
  declare staffId: number;
  declare subjectId: number;

  declare readonly subject?: Subject;
}

export function init(connection: Sequelize) {
  TeacherSubject.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'teacher_subjects',
      timestamps: true,
    },
  );
}

export function associate() {
  TeacherSubject.belongsTo(Staff, {
    foreignKey: 'staffId',
    as: 'staff',
    onDelete: 'CASCADE',
  });

  TeacherSubject.belongsTo(Subject, {
    foreignKey: 'subjectId',
    as: 'subject',
    onDelete: 'CASCADE',
  });
}

export default TeacherSubject;
