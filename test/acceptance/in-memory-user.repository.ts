import { UserRepository } from '../../src/modules/user/user.repository';
import { User } from '../../src/modules/user/user.entity';

export class InMemoryUserRepository extends UserRepository {
  private users: User[] = [];

  async clear(): Promise<void> {
    this.users = [];
  }

  async save(user: User): Promise<void> {
    const exists = await this.findByEmail(user.correo);
    if (exists) {
      throw new Error('EmailAlreadyRegisteredError');
    }
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.correo === email);
    return user || null;
  }

  async delete(email: string): Promise<void> {
    this.users = this.users.filter(u => u.correo !== email);
  }
}