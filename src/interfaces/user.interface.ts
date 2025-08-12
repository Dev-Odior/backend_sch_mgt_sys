export interface UserAttributeI {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  isAdmin: boolean;
}

export interface ProfileAttributeI {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface VerifyUserPassword {
  password: string;
  confirmPassword: string;
}

export interface UserProfileFromInviteData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

export interface InviteData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
}

export interface UserProfileInviteAttributeI {
  id: number;
  email: string;
  lastSent: Date;
}

export interface DefaultUserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
