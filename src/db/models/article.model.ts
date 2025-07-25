import {
  CreationOptional,
  INTEGER,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  Sequelize,
  TEXT,
} from 'sequelize';
import { ArticleAttributeI } from '@src/interfaces/article.interface';
import Category from '@src/db/models/category.model';
import helperUtil from '@src/utils/helper.util';
import { BadRequestError } from '@src/errors';

class Article
  extends Model<InferAttributes<Article>, InferCreationAttributes<Article>>
  implements ArticleAttributeI
{
  declare id: CreationOptional<number>;

  declare title: string;

  declare slug: string;

  declare description: string;

  declare videoUrl: string;

  declare categoryId: number;

  declare readonly body?: string;

  declare readonly category?: Category;

  declare readonly createdAt?: CreationOptional<Date>;

  static async generateUniqueSlug(name: string): Promise<string> {
    const slug = helperUtil.getSlug(name);
    const existingArticle = await this.findOne({ where: { slug } });

    if (existingArticle) {
      throw new BadRequestError('Article with this name already exists');
    }

    return slug;
  }
}

export function associate() {
  Article.belongsTo(Category, {
    as: 'category',
    foreignKey: 'categoryId',
  });
}

export function init(connection: Sequelize) {
  Article.init(
    {
      id: {
        type: INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
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
      videoUrl: {
        type: STRING,
        allowNull: true,
      },
      categoryId: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
      },
      body: {
        type: TEXT('long'),
        allowNull: true,
      },
    },
    {
      tableName: 'articles',
      timestamps: true,
      sequelize: connection,
      hooks: {
        beforeCreate: async (article) => {
          if (article.title) {
            const slug = await Article.generateUniqueSlug(article.title);
            article.slug = slug;
          }
        },
        beforeUpdate: async (article) => {
          const changes = article.changed() as string[];
          if (article.changed() && changes.includes('title')) {
            const slug = await Article.generateUniqueSlug(article.title);
            article.slug = slug;
          }
        },
      },
    },
  );
}

export default Article;
