import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import AcademicSession from './session.model';

export interface TermAttributeI {
  id: CreationOptional<number>;
  name: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

class Term
  extends Model<InferAttributes<Term>, InferCreationAttributes<Term>>
  implements TermAttributeI
{
  declare id: CreationOptional<number>;
  declare academicSessionId: number;
  declare name: string;
  declare isActive: boolean;
  declare startDate: Date;
  declare endDate: Date;

  declare readonly academicSession?: AcademicSession;
}

export function init(connection: Sequelize) {
  Term.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      academicSessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'term',
      timestamps: true,
    },
  );
}

export function associate() {
  Term.belongsTo(AcademicSession, {
    foreignKey: 'academicSessionId',
    as: 'academicSession',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

export default Term;
