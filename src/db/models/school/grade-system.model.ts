import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

export interface GradeSystemAttributeI {
  id: CreationOptional<number>;
  grade: string;
  upperRange: number;
  lowerRange: number;
}

class GradeSystem
  extends Model<InferAttributes<GradeSystem>, InferCreationAttributes<GradeSystem>>
  implements GradeSystemAttributeI
{
  declare id: CreationOptional<number>;
  declare grade: string;
  declare upperRange: number;
  declare lowerRange: number;
}

export function init(connection: Sequelize) {
  GradeSystem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      upperRange: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lowerRange: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'grade_systems',
      timestamps: true,
    },
  );
}

export function associate() {}

export default GradeSystem;
