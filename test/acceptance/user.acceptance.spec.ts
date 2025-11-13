import { UserService } from '../../src/modules/user/user.service';
import { UserRepository } from '../../src/modules/user/user.repository';
import { User } from '../../src/modules/user/user.entity';


describe('Gestión de usuarios (HU01-HU04)', () => {
  let service: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    service = new UserService(mockRepo);
  });

  
  describe('HU01 - Registro de usuario', () => {
    test('debería registrar un usuario nuevo si no existe previamente', () => {
      mockRepo.findByEmail.mockReturnValueOnce(null);
      const newUser = new User('test@example.com', 'password123');

      const result = service.register(newUser);

      expect(result).toBe(true);
      expect(mockRepo.save).toHaveBeenCalledWith(newUser);
    });

    test('no debería permitir registro si el email ya existe', () => {
      const existingUser = new User('test@example.com', 'password123');
      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      const newUser = new User('test@example.com', 'password123');
      expect(() => service.register(newUser)).toThrow();
    });
  });

  
  describe('HU02 - Inicio de sesión', () => {
    test('debería permitir inicio de sesión con credenciales válidas', () => {
      const existingUser = new User('user@example.com', 'securePass');
      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      const result = service.login('user@example.com', 'securePass');

      expect(result).toBe(true);
    });

    test('no debería permitir inicio de sesión con contraseña incorrecta', () => {
      const existingUser = new User('user@example.com', 'securePass');
      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      expect(() => service.login('user@example.com', 'wrongPass')).toThrow();
    });

    test('no debería permitir inicio de sesión si el usuario no existe', () => {
      mockRepo.findByEmail.mockReturnValueOnce(null);

      expect(() => service.login('ghost@example.com', 'pass')).toThrow();
    });
  });


  describe('HU03 - Cierre de sesión', () => {
    test('debería cerrar sesión correctamente si hay sesión activa', () => {
      expect(() => service.logout()).not.toThrow();
    });

    test('no debería fallar si no hay sesión activa (debe ser idempotente)', () => {
      expect(() => service.logout()).not.toThrow();
    });
  });


  describe('HU04 - Eliminación de cuenta', () => {
    test('debería eliminar la cuenta de un usuario existente', () => {
      const userEmail = 'delete@example.com';
      const existingUser = new User(userEmail, 'abc123');
      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      const result = service.deleteAccount(userEmail);

      expect(result).toBe(true);
      expect(mockRepo.delete).toHaveBeenCalledWith(userEmail);
    });

    test('no debería eliminar si el usuario no existe', () => {
      mockRepo.findByEmail.mockReturnValueOnce(null);

      expect(() => service.deleteAccount('ghost@example.com')).toThrow();
    });
  });
});
