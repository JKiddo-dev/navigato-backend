// Fichero: src/modules/user/user.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

// Tus errores customizados (EmailAlreadyRegisteredError, etc.)
// irían en un fichero 'user.errors.ts' y se importarían aquí.

@Injectable()
export class UserService {
  // Inyectamos el "contrato" (UserRepository), no una implementación concreta.
  constructor(
    @Inject(UserRepository) private readonly repo: UserRepository,
  ) {}

  /**
   * Registra un nuevo usuario.
   * La implementación final (Iteración 2) hasheará la contraseña
   * y comprobará si el email ya existe.
   */
  async register(user: User): Promise<User> {
    // ATDD: Empezamos con el stub
    throw new Error('Not implemented');
  }

  /**
   * Inicia sesión de un usuario.
   */
  async login(email: string, password: string): Promise<User> {
    // ATDD: Empezamos con el stub
    throw new Error('Not implemented');
  }

  /**
   * Cierra la sesión (depende de cómo manejes el estado).
   */
  async logout(): Promise<void> {
    // ATDD: Empezamos con el stub
    throw new Error('Not implemented');
  }

  /**
   * Borra la cuenta (asumiendo que el servicio sabe quién está logueado).
   */
  async deleteAccount(email: string): Promise<boolean> {
    // ATDD: Empezamos con el stub
    throw new Error('Not implemented');
  }
}