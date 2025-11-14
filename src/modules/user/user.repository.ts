import { User } from './user.entity';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract delete(email: string): Promise<void>;
}