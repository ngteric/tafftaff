export type LoginResponse = {
  access_token?: string;
  accessToken?: string;
};

export type AuthUser = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
