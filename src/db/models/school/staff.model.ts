import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { GenderEnum } from '@src/interfaces/school-entities.interface';
import { serverConfig } from '@src/configs';
import bcrypt from 'bcryptjs';
import ClassRoom from './class.model';

export enum UserRoleEnum {
  student = 'student',
  admin = 'admin',
  teacher = 'teacher',
  bursar = 'bursar',
}

export interface StaffAttributeI {
  id: CreationOptional<number>;
  fullName: string;
  email: string;
  phoneNumber: string;
  classId: number;
  gender: GenderEnum;
  password: string;
  // employeeNumber: string;
  // specialization: string;
  // dateOfBirth: Date;
  passportUrl: string;
  isActive: boolean;
  role: UserRoleEnum;
}

class Staff
  extends Model<InferAttributes<Staff>, InferCreationAttributes<Staff>>
  implements StaffAttributeI
{
  declare id: CreationOptional<number>;
  declare fullName: string;
  declare email: string;
  declare phoneNumber: string;
  declare classId: number;
  declare gender: GenderEnum;
  declare role: UserRoleEnum;
  declare password: string;
  // declare employeeNumber: string;
  // declare specialization: string;
  // declare dateOfBirth: Date;
  declare passportUrl: string;
  declare isActive: boolean;
}

export function init(connection: Sequelize) {
  Staff.init(
    {
      id: {
        type: DataTypes.INTEGER,
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
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM(...Object.values(GenderEnum)),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // employeeNumber: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // specialization: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // dateOfBirth: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
      passportUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'staff',
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

export function associate() {
  Staff.belongsTo(ClassRoom, {
    foreignKey: 'classId',
    as: 'classroom',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
}

export default Staff;
