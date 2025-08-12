import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

export interface TermAttributeI {
  id: CreationOptional<number>;
  name: string;
  startDate: Date;
  endDate: Date;
}

class Term
  extends Model<InferAttributes<Term>, InferCreationAttributes<Term>>
  implements TermAttributeI
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare startDate: Date;
  declare endDate: Date;
}

export function init(connection: Sequelize) {
  Term.init(
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

export function associate() {}

export default Term;
