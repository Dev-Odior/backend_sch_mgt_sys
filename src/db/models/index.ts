import { Sequelize } from 'sequelize';

import Article, {
  init as initArticle,
  associate as associateArticle,
} from '@src/db/models/article.model';

import Category, {
  init as initCategory,
  associate as associateCategory,
} from '@src/db/models/category.model';
import User, { init as initUser, associate as associateUser } from '@src/db/models/user.model';
import UserProfileInvite, {
  init as initUserProfileInvite,
} from '@src/db/models/userProfileInvite.model';
import Profile, {
  init as initUserProfile,
  associate as associateUserProfile,
} from '@src/db/models/userProfile.model';
import Emoji, { init as initEmoji, associate as associateEmoji } from '@src/db/models/emoji.model';

export { Article, Category, User, Profile, UserProfileInvite, Emoji };

function associate() {
  associateArticle();
  associateCategory();
  associateEmoji();
  associateUser();
  associateUserProfile();
}

export function init(connection: Sequelize) {
  initArticle(connection);
  initCategory(connection);
  initEmoji(connection);
  initUser(connection);
  initUserProfile(connection);
  initUserProfileInvite(connection);
  associate();
}
