import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from "../../src/modules/user/user.service";
import { User } from "../../src/modules/user/user.entity";
import { UserRepository } from "../../src/modules/user/user.repository";
import { InMemoryUserRepository } from "../../src/modules/user/in-memory-user.repository";


describe('Iteración 1 - Gestión de usuarios (HU01-HU04)', () => {
  let service: UserService;
  let repo: InMemoryUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService, 
        {
          provide: UserRepository,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<UserRepository>(UserRepository) as InMemoryUserRepository;
  });


  afterEach(async () => {
    await repo.clear();
  });

  // =============================================
  // HU01 - Registro
  // =============================================

  it('HU01_E01 - Registro válido (DEBE FALLAR)', async () => {
    // GIVEN 
    const user = new User('001', 'Prueba', 'García', 'test@mail.com', 'hash(pass)');

    // WHEN 
    const result = await service.register(user);

    // THEN 
    expect(result).toBeDefined();
    expect(result.correo).toBe('test@mail.com');
  });

  it('HU01_E02 - Email ya registrado (DEBE FALLAR)', async () => {
    // GIVEN 
    const existing = new User('001', 'Test', 'User', 'dupe@mail.com', 'hash');
    await repo.save(existing); // Lo guardamos de verdad en el Fake

    // WHEN 
    const newUser = new User('002', 'Nuevo', 'User', 'dupe@mail.com', 'hash2');

    // THEN 
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

    // WHEN 
    const logged = await service.login('pedro@mail.com', 'Valida');

    // THEN 
    expect(logged.sesion_activa).toBe(true);
  });

  it('HU02_E02 - Contraseña incorrecta (DEBE FALLAR)', async () => {
    // GIVEN
    const user = new User('001', 'Pedro', 'García', 'pedro@mail.com', 'hash(Valida)');
    await repo.save(user);

    // WHEN/THEN 
    await expect(
      service.login('pedro@mail.com', 'Incorrecta'),
    ).rejects.toThrow('InvalidCredentialsError');
  });

  // =============================================
  // HU03 - Logout
  // =============================================

  it('HU03_E01 - Logout válido (DEBE FALLAR)', async () => {
    // WHEN 
    await service.logout();
    // THEN
  });

  it('HU03_E02 - No hay sesión activa (DEBE FALLAR)', async () => {
    // WHEN/THEN 
    await expect(service.logout()).rejects.toThrow('NoUserAuthenticatedError');
  });

  // =============================================
  // HU04 - Eliminar cuenta
  // =============================================

  it('HU04_E01 - Eliminación válida (DEBE FALLAR)', async () => {
    // GIVEN
    const user = new User('004', 'Activo', 'User', 'del@mail.com', 'hash', true);
    await repo.save(user);

    // WHEN 
    const result = await service.deleteAccount('del@mail.com');

    // THEN 
    expect(result).toBe(true);
  });

  it('HU04_E02 - No autenticado (DEBE FALLAR)', async () => {
    // GIVEN
    const user = new User('004', 'Inactivo', 'User', 'del@mail.com', 'hash', false);
    await repo.save(user);

    // WHEN/THEN 
    await expect(
      service.deleteAccount('del@mail.com'),
    ).rejects.toThrow('AuthenticationRequiredError');
  });
});