import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import ClassRoom from './class.model';
import Term from './term.model';
import Subject from './subject.model';

export interface ClassroomAttributesI {
  id: CreationOptional<number>;
  classId: number;
  termId: number;
  subjectId: number;
}

class ClassRoomSubject
  extends Model<InferAttributes<ClassRoomSubject>, InferCreationAttributes<ClassRoomSubject>>
  implements ClassroomAttributesI
{
  declare id: CreationOptional<number>;
  declare classId: number;
  declare termId: number;
  declare subjectId: number;
}

export function init(connection: Sequelize) {
  ClassRoomSubject.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      termId: {
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
      tableName: 'classroom_subjects',
      timestamps: true,
    },
  );
}

export function associate() {
  ClassRoomSubject.belongsTo(ClassRoom, {
    foreignKey: 'classId',
    as: 'class',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ClassRoomSubject.belongsTo(Term, {
    foreignKey: 'termId',
    as: 'term',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ClassRoomSubject.belongsTo(Subject, {
    foreignKey: 'subjectId',
    as: 'subject',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

export default ClassRoomSubject;
