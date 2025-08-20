export interface MailOptionsAttributeI {
  to: string;
  from?: string;
  subject: string;
  templateName: string;
  replacements?: object;
}

export interface TeacherMailAttributeI {
  email: string;
  name: string;
  password: string;
  className: string;
}

export interface StudentMailAttributeI {
  email: string;
  name: string;
  password: string;
}
