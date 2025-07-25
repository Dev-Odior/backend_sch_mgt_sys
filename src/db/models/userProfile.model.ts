import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ProfileAttributeI } from '@src/interfaces/user.interface';
import User from '@src/db/models/user.model';

class Profile
  extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>>
  implements ProfileAttributeI
{
  declare id: CreationOptional<number>;

  declare userId: number;

  declare firstName: string;

  declare lastName: string;

  declare phoneNumber?: string;

  declare readonly user?: User;
}

export function init(connection: Sequelize) {
  
  Profile.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'user_profiles',
      timestamps: true,
      paranoid: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  Profile.belongsTo(User, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'user',
  });
}

export default Profile;
