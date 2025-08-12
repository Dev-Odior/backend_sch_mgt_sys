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
  scorePerAssessment: number;
}

class ScoreFormula
  extends Model<InferAttributes<ScoreFormula>, InferCreationAttributes<ScoreFormula>>
  implements ScoreFormulaAttributeI
{
  declare id: CreationOptional<number>;
  declare examScore: number;
  declare numberOfAssessment: number;
  declare scorePerAssessment: number;
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
      scorePerAssessment: {
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
