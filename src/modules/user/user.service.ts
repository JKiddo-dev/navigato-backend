import { UserRepository } from './user.repository';
import { User } from './user.entity';

export class UserService {
  constructor(private repo: UserRepository) {}

  register(user: User): boolean {
    throw new Error('Not implemented');
  }

  login(email: string, password: string): boolean {
    throw new Error('Not implemented');
  }

  logout(): void {
    throw new Error('Not implemented');
  }

  deleteAccount(email: string): boolean {
    throw new Error('Not implemented');
  }
}
