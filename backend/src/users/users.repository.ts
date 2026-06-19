export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UsersRepository = {
  findAll: () => Promise<UserResponse[]>;
  findById: (id: string) => Promise<UserResponse | null>;
};
