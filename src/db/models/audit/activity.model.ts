import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

export interface ActivityAttributeI {
  name: string;
  activityBy: number;
  activityOn: number;
  description: string;
}

class Activity
  extends Model<InferAttributes<Activity>, InferCreationAttributes<Activity>>
  implements ActivityAttributeI
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare activityBy: number;
  declare activityOn: number;
  declare description: string;
}

export function init(connection: Sequelize) {
  Activity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activityBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activityOn: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'activities',
      timestamps: true,
    },
  );
}

export function associate() {}

export default Activity;
