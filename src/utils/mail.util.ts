import { mailService } from '@src/services/notification';
import { MailOptionsAttributeI } from '../interfaces/notification/mail.interface';
import { StudentMailAttributeI, TeacherMailAttributeI } from '@src/interfaces/mail.interface';

class MailUtil {
  public async sendOTPMail(OTP: string, email: string): Promise<void> {
    const options: MailOptionsAttributeI = {
      to: email,
      subject: 'Verify Your Account',
      templateName: 'verifyAccount',
      replacements: {
        OTP,
      },
    };

    await mailService.sendMail(options);
  }

  public async sendTeacherRegistrationMail(teacherMailDTO: TeacherMailAttributeI): Promise<void> {
    const { email, className, password, name } = teacherMailDTO;

    const options: MailOptionsAttributeI = {
      to: email,
      subject: 'School onboarding credentials',
      templateName: 'teacherRegistrationMail',
      replacements: {
        password,
        email,
        className,
        name,
      },
    };

    await mailService.sendMail(options);
  }

  public async sendStudentRegistrationMail(studentMailDTO: StudentMailAttributeI): Promise<void> {
    const { email, password, name } = studentMailDTO;

    const options: MailOptionsAttributeI = {
      to: email,
      subject: 'School onboarding credentials',
      templateName: 'studentRegistrationMail',
      replacements: {
        password,
        email,
        name,
      },
    };

    await mailService.sendMail(options);
  }
}

export default new MailUtil();
