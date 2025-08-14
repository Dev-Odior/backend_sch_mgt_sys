import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import Staff from './staff.model';
import ClassRoomSubject from './class-subject.model';

export interface ClassroomAttributesI {
  id: CreationOptional<number>;
  name: string;
  level: string;
}

class ClassRoom
  extends Model<InferAttributes<ClassRoom>, InferCreationAttributes<ClassRoom>>
  implements ClassroomAttributesI
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare level: string;
}

export function init(connection: Sequelize) {
  ClassRoom.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'classroom',
      timestamps: true,
    },
  );
}

export function associate() {
  ClassRoom.hasMany(Staff, { foreignKey: 'classId', as: 'staffMembers' });

  ClassRoom.hasMany(ClassRoomSubject, { foreignKey: 'classId', as: 'classRoomSubjects' });
}

export default ClassRoom;
