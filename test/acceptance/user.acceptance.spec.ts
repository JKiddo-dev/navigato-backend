import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from "../../src/modules/user/user.service";
import { User } from "../../src/modules/user/user.entity";
import { UserRepository } from "../../src/modules/user/user.repository";
import { InMemoryUserRepository } from './in-memory-user.repository';

// --- ¡AQUÍ ESTÁN LOS TESTS ASÍNCRONOS! ---
describe('Iteración 1 - Gestión de usuarios (HU01-HU04)', () => {
  let service: UserService;
  let repo: InMemoryUserRepository; // Instancia del Fake para limpiar y verificar

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService, // 1. El SUT (Servicio real, pero stub)
        {
          provide: UserRepository,    // 2. El "Token" de la dependencia
          useClass: InMemoryUserRepository, // 3. ¡La magia! Sustituimos por el Fake
        },
      ],
    }).compile();

    // Nest inyecta automáticamente el InMemoryUserRepository en el UserService
    service = module.get<UserService>(UserService);
    repo = module.get<UserRepository>(UserRepository) as InMemoryUserRepository;
  });

  // ¡Importante! Limpiamos la BBDD en memoria después de CADA test
  afterEach(async () => {
    await repo.clear();
  });

  // =============================================
  // HU01 - Registro
  // =============================================

  it('HU01_E01 - Registro válido (DEBE FALLAR)', async () => {
    // GIVEN (El repo está vacío gracias al afterEach)
    const user = new User('001', 'Prueba', 'García', 'test@mail.com', 'hash(pass)');

    // WHEN (Esta línea lanzará el error "Not implemented")
    const result = await service.register(user);

    // THEN (El test nunca llegará aquí, por eso fallará)
    expect(result).toBeDefined();
    expect(result.correo).toBe('test@mail.com');
  });

  it('HU01_E02 - Email ya registrado (DEBE FALLAR)', async () => {
    // GIVEN (Un usuario ya existe en el Fake)
    const existing = new User('001', 'Test', 'User', 'dupe@mail.com', 'hash');
    await repo.save(existing); // Lo guardamos de verdad en el Fake

    // WHEN (El servicio intentará registrarlo)
    const newUser = new User('002', 'Nuevo', 'User', 'dupe@mail.com', 'hash2');

    // THEN (Esperamos que el servicio lance el error)
    // (Esta prueba fallará con "Not implemented" en lugar de "EmailAlreadyRegisteredError")
    await expect(service.register(newUser)).rejects.toThrow(
      'EmailAlreadyRegisteredError',
    );
  });

  // =============================================
  // HU02 - Login
  // =============================================

  it('HU02_E01 - Login válido (DEBE FALLAR)', async () => {
    // GIVEN
    const user = new User('001', 'Pedro', 'García', 'pedro@mail.com', 'hash(Valida)');
    await repo.save(user);

    // WHEN (Esta línea lanzará "Not implemented")
    const logged = await service.login('pedro@mail.com', 'Valida');

    // THEN (Nunca llegará aquí)
    expect(logged.sesion_activa).toBe(true);
  });

  it('HU02_E02 - Contraseña incorrecta (DEBE FALLAR)', async () => {
    // GIVEN
    const user = new User('001', 'Pedro', 'García', 'pedro@mail.com', 'hash(Valida)');
    await repo.save(user);

    // WHEN/THEN (Fallará con "Not implemented")
    await expect(
      service.login('pedro@mail.com', 'Incorrecta'),
    ).rejects.toThrow('InvalidCredentialsError');
  });

  // =============================================
  // HU03 - Logout
  // =============================================

  it('HU03_E01 - Logout válido (DEBE FALLAR)', async () => {
    // WHEN (Fallará con "Not implemented")
    await service.logout();
    // THEN (No hay 'then', solo esperamos que no lance error)
  });

  it('HU03_E02 - No hay sesión activa (DEBE FALLAR)', async () => {
    // WHEN/THEN (Fallará con "Not implemented")
    await expect(service.logout()).rejects.toThrow('NoUserAuthenticatedError');
  });

  // =============================================
  // HU04 - Eliminar cuenta
  // =============================================

  it('HU04_E01 - Eliminación válida (DEBE FALLAR)', async () => {
    // GIVEN
    const user = new User('004', 'Activo', 'User', 'del@mail.com', 'hash', true);
    await repo.save(user);

    // WHEN (Fallará con "Not implemented")
    const result = await service.deleteAccount('del@mail.com');

    // THEN (Nunca llegará aquí)
    expect(result).toBe(true);
  });

  it('HU04_E02 - No autenticado (DEBE FALLAR)', async () => {
    // GIVEN
    const user = new User('004', 'Inactivo', 'User', 'del@mail.com', 'hash', false);
    await repo.save(user);

    // WHEN/THEN (Fallará con "Not implemented")
    await expect(
      service.deleteAccount('del@mail.com'),
    ).rejects.toThrow('AuthenticationRequiredError');
  });
});