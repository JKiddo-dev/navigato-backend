import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
  
  constructor(
    @Inject(UserRepository) private readonly repo: UserRepository,
  ) {}

  async register(user: User): Promise<User> {
    throw new Error('Not implemented');
  }

  async login(email: string, password: string): Promise<User> {
    throw new Error('Not implemented');
  }

  async logout(): Promise<void> {
    throw new Error('Not implemented');
  }

  async deleteAccount(email: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}