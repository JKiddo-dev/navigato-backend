import { FavoriteService } from '../../src/modules/favorites/favorites.service';
import { FavoriteRepository } from '../../src/modules/favorites/favorites.repository';
import { Favorite } from '../../src/modules/favorites/favorites.entity';

describe('HU20 - Gestión de favoritos', () => {
  let service: FavoriteService;
  let mockRepo: jest.Mocked<FavoriteRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findByUserAndItem: jest.fn(),
      delete: jest.fn(),
      listByUser: jest.fn(),
    } as unknown as jest.Mocked<FavoriteRepository>;

    service = new FavoriteService(mockRepo);
  });

  /**
   * HU20 - Como usuario quiero poder marcar como favorito cada elemento
   */

  test('Escenario VÁLIDO: marcar un elemento como favorito cuando no lo estaba', () => {
    // GIVEN el elemento "Ruta al trabajo" existe en el sistema
    // AND para ese usuario todavía no está marcado como favorito
    const fav = new Favorite('user@example.com', 'Ruta al trabajo');
    mockRepo.findByUserAndItem.mockReturnValueOnce(null);

    // WHEN el usuario marca el elemento como favorito
    const result = service.markFavorite(fav);

    // THEN el sistema guarda el favorito correctamente
    expect(result).toBe(true);
    expect(mockRepo.save).toHaveBeenCalledWith(fav);
  });

  test('Escenario INVÁLIDO: desmarcar un favorito que no existe lanza error', () => {
    // GIVEN el usuario NO tiene el elemento "Ruta al cine" en su lista de favoritos
    const fav = new Favorite('user@example.com', 'Ruta al cine');
    mockRepo.findByUserAndItem.mockReturnValueOnce(null);

    // WHEN intenta desmarcarlo como favorito
    // THEN se lanza la excepción "FavoriteNotFoundError" (o similar)
    expect(() => service.unmarkFavorite(fav)).toThrow('FavoriteNotFoundError');
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  // (Opcional, pero lo puedes dejar porque es coherente con la HU20)
  test('debería listar todos los favoritos de un usuario', () => {
    const favorites = [
      new Favorite('user@example.com', 'item1'),
      new Favorite('user@example.com', 'item2'),
    ];
    mockRepo.listByUser.mockReturnValueOnce(favorites);

    const result = service.listFavorites('user@example.com');

    expect(result).toEqual(favorites);
    expect(mockRepo.listByUser).toHaveBeenCalledWith('user@example.com');
  });
});
