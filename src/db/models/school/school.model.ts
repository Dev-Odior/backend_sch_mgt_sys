import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

export interface SchoolAttributeI {
  id: CreationOptional<number>;
  name: string;
  address: string;
  contact: string;
  logoUrl: string;
  certificateUrl?: string;
}

class School
  extends Model<InferAttributes<School>, InferCreationAttributes<School>>
  implements SchoolAttributeI
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare address: string;
  declare contact: string;
  declare logoUrl: string;
  declare certificateUrl?: string;
}

export function init(connection: Sequelize) {
  School.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      certificateUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'schools',
      timestamps: true,
    },
  );
}

export function associate() {}

export default School;
