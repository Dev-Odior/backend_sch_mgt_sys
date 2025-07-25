import {
  INTEGER,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  STRING,
  type Sequelize,
  CreationOptional,
} from 'sequelize';
import { type CategoryAttributeI, type CategoryTypes } from '@src/interfaces/category.interface';
import Article from '@src/db/models/article.model';
import helperUtil from '@src/utils/helper.util';
import { BadRequestError } from '@src/errors';
import Emoji from '@src/db/models/emoji.model';

class Category
  extends Model<InferAttributes<Category>, InferCreationAttributes<Category>>
  implements CategoryAttributeI
{
  declare id: CreationOptional<number>;

  declare name: string;

  declare slug?: string;

  declare description: string;

  declare emojiId?: number;

  declare parentId?: number;

  declare type: CategoryTypes;

  declare readonly parent?: Category;

  declare readonly emoji?: Emoji;

  declare readonly articles?: Article[];

  declare readonly createdAt?: CreationOptional<Date>;

  /**
   * Generate a unique slug based on the provided name.
   *
   * @param {string} name - the name to generate the slug from
   * @return {Promise<string>} the unique slug generated
   */ 
  static async generateUniqueSlug(name: string): Promise<string> {
    const slug = helperUtil.getSlug(name);
    const existingCategory = await this.findOne({ where: { slug } });

    if (existingCategory) {
      throw new BadRequestError('Category with this name already exists');
    }

    return slug;
  }
}

export function associate(): void {
  Category.hasMany(Article, {
    as: 'articles',
    foreignKey: 'categoryId',
  });

  Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parentId',
  });

  Category.belongsTo(Emoji, {
    as: 'emoji',
    foreignKey: 'emojiId',
  });
}

export function init(connection: Sequelize): void {
  Category.init(
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
      slug: {
        type: STRING,
        allowNull: true,
      },
      description: {
        type: STRING,
        allowNull: false,
      },
      emojiId: {
        type: INTEGER.UNSIGNED,
        allowNull: true,
      },
      parentId: {
        type: INTEGER.UNSIGNED,
        allowNull: true,
      },
      type: {
        type: STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'categories',
      timestamps: true,
      sequelize: connection,
      hooks: {
        beforeCreate: async (category) => {
          if (category.name) {
            const slug = await Category.generateUniqueSlug(category.name);
            category.slug = slug;
          }
        },
        beforeUpdate: async (category) => {
          const changes = category.changed() as string[];
          if (category.changed() && changes.includes('name')) {
            const slug = await Category.generateUniqueSlug(category.name);
            category.slug = slug;
          }
        },
      },
    },
  );
}

export default Category;
