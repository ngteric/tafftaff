export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithPassword = UserResponse & {
  password: string;
};

export type CreateUserData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UsersRepository = {
  findAll: () => Promise<UserResponse[]>;
  findById: (id: string) => Promise<UserResponse | null>;
  findByEmail: (email: string) => Promise<UserWithPassword | null>;
  create: (data: CreateUserData) => Promise<UserResponse>;
};
