import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

export interface ScoreFormulaAttributeI {
  id: CreationOptional<number>;
  examScore: number;
  numberOfAssessment: number;
  assessmentScore: number;
}

class ScoreFormula
  extends Model<InferAttributes<ScoreFormula>, InferCreationAttributes<ScoreFormula>>
  implements ScoreFormulaAttributeI
{
  declare id: CreationOptional<number>;
  declare examScore: number;
  declare numberOfAssessment: number;
  declare assessmentScore: number;
}

export function init(connection: Sequelize) {
  ScoreFormula.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      examScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numberOfAssessment: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assessmentScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'score_formula',
      timestamps: true,
    },
  );
}

export function associate() {}

export default ScoreFormula;
