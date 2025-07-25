import { Request } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '@src/db/models/user.model';
import { BadRequestError, ConflictError, NotFoundError } from '@src/errors';
import { DecodedToken } from '@src/interfaces/auth.interface';
// import mailUtil from '@src/utils/mail.util';
import authConfig from '@src/configs/auth.config';
// import userProfileService from '@src/services/userProfile.service';

class AuthService {
  constructor(private UserModel: typeof User) {}

  private AuthEncryptKey = fs.readFileSync(path.join(process.cwd(), 'private.key')).toString();
  private AuthDecryptKey = fs.readFileSync(path.join(process.cwd(), 'public.key')).toString();

  public async login(user: User) {
    if (!user.isVerified) {
      throw new ConflictError('You need to verify your account before you can login.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toJSON();

    const payloadUser = userWithoutPassword as User;

    const accessToken = this.generateAccessToken(payloadUser);

    await this.updateLastLogin(user);

    return { user: userWithoutPassword, accessToken };
  }

  public async getUserProfile() {
    // const userProfile = await userProfileService.getByUserId(user.id);
    const userProfile = '';

    if (!userProfile) {
      throw new NotFoundError('Information about this user is not found.');
    }

    return userProfile;
  }

  private generateAccessToken(user: User): string {
    const accessToken = jwt.sign({ ...user }, this.AuthEncryptKey, {
      algorithm: 'RS256',
      expiresIn: authConfig.ACCESS_TOKEN_EXPIRES_IN,
    });

    return accessToken;
  }

  public validatePassword(user: User, password: string): boolean {
    try {
      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new BadRequestError('Error validating password at the moment');
    }
  }

  public async getUserForLogin(email: string, password: string) {
    const user = await this.UserModel.scope('withPassword').findOne({
      where: { email },
    });

    if (!user || !this.validatePassword(user, password)) {
      throw new ConflictError('Admin email or password is incorrect.');
    }

    return user;
  }

  public verifyToken(token: string): DecodedToken {
    try {
      const payload = jwt.verify(token, this.AuthDecryptKey) as unknown as User;
      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes('expired') ? error.message : error,
      };
    }
  }

  public async forgotPassword(email: string, req: Request): Promise<User> {
    const user = await this.UserModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError(`Admin user with email '${email}' does not exist.`);
    }

    // await mailUtil.sendForgotPasswordMail(user, operatingSystem, browserName);
    return user;
  }

  private async updateLastLogin(user: User): Promise<void> {
    await user.set('lastLogin', new Date()).save();
  }
}

export default new AuthService(User);

// export class Testing {
//   constructor(private UserModel: typeof User) {}

//   private AuthEncryptKey = fs.readFileSync(path.join(process.cwd(), 'private.key')).toString();

//   private AuthDecryptKey = fs.readFileSync(path.join(process.cwd(), 'public.key')).toString();

//   public async login(user: User) {
//     if (!user.isVerified) {
//       throw new ConflictError('You need to verify your account before you can login.');
//     }

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...userWithoutPassword } = user.toJSON();

//     const payloadUser = userWithoutPassword as User;

//     const accessToken = this.generateAccessToken(payloadUser);

//     await this.updateLastLogin(user);

//     return { user: userWithoutPassword, accessToken };
//   }

//   public async getUserProfile(user: User) {
//     const userProfile = await userProfileService.getByUserId(user.id);

//     if (!userProfile) {
//       throw new NotFoundError('Information about this user is not found.');
//     }

//     return userProfile;
//   }

//   private generateAccessToken(user: User): string {
//     const accessToken = jwt.sign({ ...user }, this.AuthEncryptKey, {
//       algorithm: 'RS256',
//       expiresIn: authConfig.ACCESS_TOKEN_EXPIRES_IN,
//     });

//     return accessToken;
//   }

//   public validatePassword(user: User, password: string): boolean {
//     try {
//       return bcrypt.compareSync(password, user.password);
//     } catch (error) {
//       throw new BadRequestError('Error validating password at the moment');
//     }
//   }

//   public async getUserForLogin(email: string, password: string) {
//     const user = await this.UserModel.scope('withPassword').findOne({
//       where: { email },
//     });

//     if (!user || !this.validatePassword(user, password)) {
//       throw new ConflictError('Admin email or password is incorrect.');
//     }

//     return user;
//   }

//   public verifyToken(token: string): DecodedToken {
//     try {
//       const payload = jwt.verify(token, this.AuthDecryptKey) as unknown as User;
//       return {
//         payload,
//         expired: false,
//       };
//     } catch (error) {
//       return {
//         payload: null,
//         expired: error.message.includes('expired') ? error.message : error,
//       };
//     }
//   }

//   public async forgotPassword(email: string, req: Request): Promise<User> {
//     const user = await this.UserModel.findOne({ where: { email } });

//     if (!user) {
//       throw new NotFoundError(`Admin user with email '${email}' does not exist.`);
//     }

//     const [operatingSystem, browserName] = [
//       helperUtil.getOSName(req),
//       helperUtil.getBrowserName(req),
//     ];

//     await mailUtil.sendForgotPasswordMail(user, operatingSystem, browserName);
//     return user;
//   }

//   private async updateLastLogin(user: User): Promise<void> {
//     await user.set('lastLogin', new Date()).save();
//   }
// }
