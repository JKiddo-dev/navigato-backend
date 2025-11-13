import { User } from '../user/user.entity';

export class UserRepository {
  save(user: User): void {
    throw new Error('Not implemented');
  }

  findByEmail(email: string): User | null {
    throw new Error('Not implemented');
  }

  delete(email: string): void {
    throw new Error('Not implemented');
  }
}
