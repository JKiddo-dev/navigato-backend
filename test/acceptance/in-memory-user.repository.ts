// Fichero: test/fakes/in-memory-user.repository.ts

import { UserRepository } from '../../src/modules/user/user.repository';
import { User } from '../../src/modules/user/user.entity';

// --- ¡AQUÍ ESTÁ EL "FAKE"! (BBDD en memoria) ---
// Esta es la clase que imita tu base de datos, pero en un array.
// Implementa el "contrato" asíncrono de UserRepository.

export class InMemoryUserRepository extends UserRepository {
  private users: User[] = [];

  // Método para limpiar la BBDD en memoria entre tests
  async clear(): Promise<void> {
    this.users = [];
  }

  async save(user: User): Promise<void> {
    // Simulamos una restricción de email único (como haría la BBDD)
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