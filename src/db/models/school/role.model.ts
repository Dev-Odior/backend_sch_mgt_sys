import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { RolesEnum } from '@src/interfaces/school-entities.interface';
import Staff from './staff.model';

export interface RoleAttributeI {
  id: CreationOptional<number>;
  staffId: number;
  name: RolesEnum;
}

class Role
  extends Model<InferAttributes<Role>, InferCreationAttributes<Role>>
  implements RoleAttributeI
{
  declare id: CreationOptional<number>;
  declare staffId: number;
  declare name: RolesEnum;
}

export function init(connection: Sequelize) {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.ENUM(...Object.values(RolesEnum)),
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'role',
      timestamps: true,
    },
  );
}

export function associate() {
  Role.belongsTo(Staff, {
    foreignKey: 'staffId',
    as: 'staff',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

export default Role;
