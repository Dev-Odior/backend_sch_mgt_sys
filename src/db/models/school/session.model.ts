import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import Term from './term.model';

export interface AcademicSessionAttributes {
  id: CreationOptional<number>;
  name: string;
  isCurrent: boolean;
  numberOfTerms: number;
}

class AcademicSession
  extends Model<
    InferAttributes<AcademicSession, { omit: 'terms' }>,
    InferCreationAttributes<AcademicSession, { omit: 'terms' }>
  >
  implements AcademicSessionAttributes
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare isCurrent: boolean;
  declare numberOfTerms: number;

  // Association
  declare terms?: NonAttribute<Term[]>;
}

export function init(connection: Sequelize) {
  AcademicSession.init(
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
      isCurrent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      numberOfTerms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
    },
    {
      sequelize: connection,
      tableName: 'academic_session',
      timestamps: true,
    },
  );
}

export function associate() {
  AcademicSession.hasMany(Term, {
    foreignKey: 'academicSessionId',
    as: 'terms',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

export default AcademicSession;
