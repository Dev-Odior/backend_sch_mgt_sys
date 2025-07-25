import bcrypt from 'bcryptjs';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { UserAttributeI } from '@src/interfaces/user.interface';
import Profile from '@src/db/models/userProfile.model';
import authConfig from '@src/configs/auth.config';

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributeI
{
  declare id: CreationOptional<number>;

  declare fullName: string;

  declare email: string;

  declare isAdmin: boolean;

  declare isSocial: boolean;

  declare isVerified: boolean;

  declare password?: string;

  declare lastLogin?: Date;

  declare readonly profile?: Profile;

  declare readonly createdAt?: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isSocial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      paranoid: true,
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
            const salt = bcrypt.genSaltSync(authConfig.BCRYPT_SALT_ROUNDS);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          const changes = user.changed() as string[];
          if (user.changed() && changes.includes('password')) {
            const salt = bcrypt.genSaltSync(authConfig.BCRYPT_SALT_ROUNDS);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
      sequelize: connection,
    },
  );
}

export function associate() {
  User.hasOne(Profile, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'profile',
  });
}

export default User;
