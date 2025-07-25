export enum CategoryTypes {
  'Main' = 'main',
  'Sub' = 'sub',
  'LeastSub' = 'least-sub',
}

export interface CategoryAttributeI {
  id: number;
  name: string;
  slug?: string;
  description: string;
  emojiId?: number;
  parentId?: number;
  type: CategoryTypes;
}
