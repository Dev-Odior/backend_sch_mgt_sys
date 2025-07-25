import {
  INTEGER,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  STRING,
  type Sequelize,
  CreationOptional,
} from 'sequelize';
import { type EmojiAttributeI } from '@src/interfaces/emoji.interface';

class Emoji
  extends Model<InferAttributes<Emoji>, InferCreationAttributes<Emoji>>
  implements EmojiAttributeI
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare code: string;
}

export function associate(): void {}

export function init(connection: Sequelize): void {
  Emoji.init(
    {
      id: {
        type: INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      code: {
        type: STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'emojis',
      sequelize: connection,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  );
}

export default Emoji;
