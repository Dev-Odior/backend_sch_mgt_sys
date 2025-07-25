import { DefaultUserProfileData } from '@src/interfaces/user.interface';
import userProfiles from '@src/resources/defaults/userProfiles.json';
// import authConfig from '@src/configs/auth.config';
import { EmojiAttributeI } from '@src/interfaces/emoji.interface';

class DefaultData {
  private readonly defaultUserProfiles: DefaultUserProfileData[];
  private readonly defaultEmojis: EmojiAttributeI[];

  constructor(defaultUserProfiles = userProfiles) {
    this.defaultUserProfiles = defaultUserProfiles;
    // this.defaultEmojis = defaultEmojis;
  }

  public async runDataMigration() {
    await this.migrateDefaultUserProfiles();
    await this.importDefaultEmojis();
  }

  private async migrateDefaultUserProfiles() {
    this.defaultUserProfiles.forEach(async () => {
      // const user = await userService.create({
      //   fullName: `${defaultUserProfile.firstName} ${defaultUserProfile.lastName}`,
      //   email: defaultUserProfile.email,
      //   isSocial: false,
      //   isVerified: true,
      //   isAdmin: true,
      //   password: authConfig.DEFAULT_USER_PROFILE_PASSWORD,
      // });
      // await userProfileService.create({
      //   firstName: defaultUserProfile.firstName,
      //   lastName: defaultUserProfile.lastName,
      //   phoneNumber: defaultUserProfile.phoneNumber,
      //   userId: user.id,
      // });
    });
  }

  private async importDefaultEmojis() {}
}

export default new DefaultData();
