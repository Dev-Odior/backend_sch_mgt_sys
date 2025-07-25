import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { UserProfileInviteAttributeI } from '@src/interfaces/user.interface';

export class UserProfileInvite
  extends Model<InferAttributes<UserProfileInvite>, InferCreationAttributes<UserProfileInvite>>
  implements UserProfileInviteAttributeI
{
  declare id: CreationOptional<number>;

  declare email: string;

  declare lastSent: Date;

  declare readonly createdAt?: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  UserProfileInvite.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      lastSent: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'profile_user_invites',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default UserProfileInvite;
