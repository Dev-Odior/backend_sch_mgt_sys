import { GenderEnum } from '@src/interfaces/school-entities.interface';

import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import Classroom from '../school/class.model';
import { UserRoleEnum } from '../school/staff.model';
import { serverConfig } from '@src/configs';
import bcrypt from 'bcryptjs';

export interface StudentAttributesI {
  id: CreationOptional<number>;
  surname: string;
  firstName: string;
  middleName: string;
  dateOfBirth: Date;
  classId: number;
  gender: GenderEnum;
  admissionNumber: number;
  email: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  passportUrl: string;
  password: string;
  role: UserRoleEnum;
}

class Student
  extends Model<InferAttributes<Student>, InferCreationAttributes<Student>>
  implements StudentAttributesI
{
  declare id: CreationOptional<number>;
  declare surname: string;
  declare firstName: string;
  declare middleName: string;
  declare dateOfBirth: Date;
  declare classId: number;
  declare gender: GenderEnum;
  declare admissionNumber: number;
  declare email: string;
  declare guardianName: string;
  declare guardianPhone: string;
  declare address: string;
  declare passportUrl: string;
  declare password: string;
  declare role: UserRoleEnum;
}

export function init(connection: Sequelize) {
  Student.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM(...Object.values(GenderEnum)),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
        allowNull: false,
      },
      admissionNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      guardianName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guardianPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passportUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'student', // lowercase snake_case
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
  Student.belongsTo(Classroom, {
    foreignKey: 'classId',
    as: 'class',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

export default Student;
