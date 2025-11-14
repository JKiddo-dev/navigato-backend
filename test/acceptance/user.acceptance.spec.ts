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

  /**
   * HU01 - Como usuario no registrado quiero poder registrarme
   */

  describe('HU01 - Registro de usuario', () => {
    test('Escenario VÁLIDO: registra un nuevo usuario cuando el email no existe', () => {
      // GIVEN lista de usuarios registrados en el sistema es []
      mockRepo.findByEmail.mockReturnValueOnce(null);
      const newUser: User = {
        email: 'pruebasistema@gmail.com',
        password: 'Prueba-34',
        nombre: 'Prueba',
        apellidos: 'García Fernández',
      } as unknown as User;

      const result = service.register(newUser);

      // THEN el sistema registra al usuario y lo guarda en el repositorio
      expect(result).toBe(true);
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'pruebasistema@gmail.com',
          password: 'Prueba-34',
          nombre: 'Prueba',
          apellidos: 'García Fernández',
        }),
      );
    });

    test('Escenario INVÁLIDO: no permite registro si el email ya está registrado', () => {
      // GIVEN ya existe un usuario con ese correo
      const existingUser: User = {
        email: 'pruebasistema@gmail.com',
        password: 'Prueba-34',
      } as unknown as User;

      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      const newUser: User = {
        email: 'pruebasistema@gmail.com',
        password: 'Prueba-34',
      } as unknown as User;

      // WHEN intenta registrarse de nuevo
      // THEN se lanza la excepción "EmailAlreadyRegisteredError"
      expect(() => service.register(newUser)).toThrow('EmailAlreadyRegisteredError');
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  /**
   * HU02 - Como usuario registrado quiero iniciar sesión
   */
  describe('HU02 - Inicio de sesión', () => {
    test('Escenario VÁLIDO: permite inicio de sesión con credenciales correctas', () => {
      // GIVEN usuario registrado con contraseña válida
      const existingUser: User = {
        email: 'usuario.registrado@ejemplo.com',
        password: 'ClaveValida-123',
      } as unknown as User;

      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      // WHEN introduce el correo y la contraseña correctos
      const result = service.login('usuario.registrado@ejemplo.com', 'ClaveValida-123');

      // THEN el inicio de sesión tiene éxito
      expect(result).toBe(true);
    });

    test('Escenario INVÁLIDO: contraseña incorrecta lanza InvalidCredentialsError', () => {
      // GIVEN usuario registrado pero introduce contraseña incorrecta
      const existingUser: User = {
        email: 'usuario.registrado@ejemplo.com',
        password: 'ClaveValida-123',
      } as unknown as User;

      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      // WHEN la contraseña es incorrecta
      // THEN se lanza "InvalidCredentialsError"
      expect(() =>
        service.login('usuario.registrado@ejemplo.com', 'ClaveIncorrecta-999'),
      ).toThrow('InvalidCredentialsError');
    });
  });

  /**
   * HU03 - Como usuario quiero poder cerrar la sesión
   */
  describe('HU03 - Cierre de sesión', () => {
    test('Escenario VÁLIDO: un usuario con sesión iniciada cierra su sesión', () => {
      // GIVEN existe un usuario registrado y sin sesión activa aún
      const existingUser: User = {
        email: 'usuario.activo@ejemplo.com',
        password: 'securePass',
      } as unknown as User;

      mockRepo.findByEmail.mockReturnValueOnce(existingUser);

      // AND el usuario inicia sesión correctamente
      service.login('usuario.activo@ejemplo.com', 'securePass');

      // WHEN solicita cerrar sesión
      const result = service.logout();

      // THEN el cierre de sesión se realiza correctamente
      expect(result).toBe(true);
    });

    test('Escenario INVÁLIDO: visitante anónimo intenta cerrar sesión', () => {
      // GIVEN no hay ninguna sesión activa

      // WHEN se llama a logout sin haber hecho login
      // THEN se lanza "NoUserAuthenticatedError"
      expect(() => service.logout()).toThrow('NoUserAuthenticatedError');
    });
  });

  /**
   * HU04 - Como usuario quiero poder eliminar mi cuenta
   */
  describe('HU04 - Eliminación de cuenta', () => {
    test('Escenario VÁLIDO: usuario autenticado elimina su cuenta', () => {
      const email = 'usuario.a.eliminar@ejemplo.com';

      // GIVEN existe un usuario registrado y una sesión activa
      const existingUser: User = {
        email,
        password: 'Prueba-34',
      } as unknown as User;

      // Primera llamada: login, segunda llamada: deleteAccount (si lo necesitas)
      mockRepo.findByEmail.mockReturnValue(existingUser);

      // el usuario inicia sesión
      service.login(email, 'Prueba-34');

      // WHEN solicita eliminar su cuenta
      const result = service.deleteAccount(email);

      // THEN se elimina la cuenta y se borra del repositorio
      expect(result).toBe(true);
      expect(mockRepo.delete).toHaveBeenCalledWith(email);
    });

    test('Escenario INVÁLIDO: usuario no autenticado intenta eliminar su cuenta', () => {
      const email = 'usuario.a.eliminar@ejemplo.com';

      const existingUser: User = {
        email,
        password: 'Prueba-34',
      } as unknown as User;

      // El usuario existe en la BD pero NO hay sesión activa
      mockRepo.findByEmail.mockReturnValue(existingUser);

      // WHEN intenta eliminar la cuenta sin estar autenticado
      // THEN se lanza "AuthenticationRequiredError" y NO se borra nada
      expect(() => service.deleteAccount(email)).toThrow('AuthenticationRequiredError');
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });
});
