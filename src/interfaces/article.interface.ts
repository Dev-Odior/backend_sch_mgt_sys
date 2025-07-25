export enum ArticleBodyType {
  'Text' = 'text',
  'Icon' = 'icon',
  'Image' = 'image',
  'Callout' = 'callout',
  'List' = 'list',
}

export interface ArticleBodyAttributeI {
  id: number;
  articleId: number;
  type: ArticleBodyType;
  content: string;
}

export interface ArticleAttributeI {
  id: number;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  categoryId: number;
}

export interface CreateUpdateArticleData {
  title: string;
  description: string;
  videoUrl: string;
  categoryId: number;
  body: string;
}
