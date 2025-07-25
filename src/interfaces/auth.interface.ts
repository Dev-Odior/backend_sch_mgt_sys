import User from '@src/db/models/user.model';

export interface DecodedToken {
  payload: User | null;
  expired: boolean | string | Error;
}

export interface Passwords {
  password?: string;
  currentPassword?: string;
  confirmPassword?: string;
}
