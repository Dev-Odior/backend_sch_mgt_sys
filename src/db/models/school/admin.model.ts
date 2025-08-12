import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import { UserRoleEnum } from './staff.model';
import { serverConfig } from '@src/configs';

export interface AdminInfoAttributeI {
  id?: number;
  fullName: string;
  profile: string;
  profileImageUrl: string;
}

class Admin
  extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>>
  implements AdminInfoAttributeI
{
  declare id: CreationOptional<number>;
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare profile: string;
  declare profileImageUrl: string;
  declare role: UserRoleEnum;
}

export function init(connection: Sequelize) {
  Admin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
        allowNull: false,
        defaultValue: UserRoleEnum.admin,
      },
    },
    {
      sequelize: connection,
      tableName: 'admin_info',
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ['password'],
          },
        },
      },
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = bcrypt.genSaltSync(serverConfig.BCRYPT_SALT_ROUNDS);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          const changes = user.changed() as string[];
          if (user.changed() && changes.includes('password')) {
            const salt = bcrypt.genSaltSync(serverConfig.BCRYPT_SALT_ROUNDS);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
    },
  );
}

export function associate() {}

export default Admin;
