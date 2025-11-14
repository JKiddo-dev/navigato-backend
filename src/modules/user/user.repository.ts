// Fichero: src/modules/user/user.repository.ts

import { User } from './user.entity';

// Usamos una clase abstracta como "Token" de Inyección de Dependencias (DI).
// ¡Todos los métodos devuelven Promise porque son asíncronos!
export abstract class UserRepository {
  abstract save(user: User): Promise<void>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract delete(email: string): Promise<void>;
}