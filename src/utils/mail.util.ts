// import User from '@src/db/models/user.model';
// import { MailOptionsAttributeI } from '@src/interfaces/mail.interface';
// import serverConfig from '@src/configs/server.config';
// import notificationHelper from '@src/helpers/notification.helper';
// // import userService from '@src/services/user.service';
// // import inviteService from '@src/services/invite.service';
// import UserProfileInvite from '@src/db/models/userProfileInvite.model';

// class MailUtil {
//   public async sendForgotPasswordMail(
//     user: User,
//     operatingSystem: string,
//     browserName: string,
//   ): Promise<void> {
//     const { id, email, fullName } = user;
//     const token = await userService.generateVerificationToken(id);
//     const options: MailOptionsAttributeI = {
//       to: email,
//       subject: 'Reset my Password',
//       templateName: 'forgotPassword',
//       replacements: {
//         email,
//         fullName,
//         operatingSystem,
//         browserName,
//         link: `${serverConfig.FRONTEND_URL}/reset-password?uid=${id}&token=${token}`,
//       },
//     };
//     await notificationHelper.sendMail(options);
//   }

//   public async sendInviteMail(invite: UserProfileInvite): Promise<void> {
//     const { email, id: uid } = invite;

//     const token = inviteService.generateToken(invite);

//     const options: MailOptionsAttributeI = {
//       to: email,
//       subject: 'HCMatrix User Guide Invite',
//       templateName: 'userGuideInvite',
//       replacements: {
//         email,
//         verifyLink: `${serverConfig.FRONTEND_URL}/invite?uid=${uid}&email=${email}&token=${token}`,
//       },
//     };

//     invite.update({ lastSent: new Date() });

//     await notificationHelper.sendMail(options);
//   }

//   public async sendBulkInviteMail(invites: UserProfileInvite[]): Promise<void> {
//     await Promise.all([
//       invites.forEach(async (invite) => {
//         this.sendInviteMail(invite);
//       }),
//     ]);
//   }

//   public async sendWelcomeMail(user: User): Promise<void> {
//     const { id: uid, email, fullName, isVerified } = user;

//     const options: MailOptionsAttributeI = {
//       to: email,
//       subject: 'Welcome to HCMatrix Admin Portal',
//       templateName: 'welcomeAdminVerifiedUser',
//       replacements: {
//         fullName,
//         email,
//         loginLink: `${serverConfig.FRONTEND_URL}/login?email=${email}`,
//       },
//     };

//     if (!isVerified) {
//       const token = await userService.generateVerificationToken(uid);

//       options.templateName = 'welcomeAdminUnverifiedUser';
//       // eslint-disable-next-line @typescript-eslint/dot-notation
//       options.replacements['verifyLink'] =
//         `${serverConfig.FRONTEND_URL}/verify?uid=${uid}&email=${email}&token=${token}`;
//     }

//     await notificationHelper.sendMail(options);
//   }

//   public async sendBulkWelcomeMail(users: User[]): Promise<void> {
//     for (const user of users) {
//       await this.sendWelcomeMail(user);
//     }
//   }
// }

// export default new MailUtil();
