import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import StudentSubjectScores from '../student/student-score.model';

export interface SubjectAttributeI {
  id: CreationOptional<number>;
  name: string;
}

class Subject
  extends Model<InferAttributes<Subject>, InferCreationAttributes<Subject>>
  implements SubjectAttributeI
{
  declare id: CreationOptional<number>;
  declare name: string;
}

export function init(connection: Sequelize) {
  Subject.init(
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
    },
    {
      sequelize: connection,
      tableName: 'subject',
      timestamps: true,
    },
  );
}

export function associate() {
  Subject.hasMany(StudentSubjectScores, {
    foreignKey: 'subjectId',
    as: 'studentScores',
    onDelete: 'CASCADE',
  });
}

export default Subject;
