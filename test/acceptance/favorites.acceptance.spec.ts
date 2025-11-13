import { FavoriteService } from '../../src/modules/favorites/favorites.service';
import { FavoriteRepository } from '../../src/modules/favorites/favorites.repository';
import { Favorite } from '../../src/modules/favorites/favorites.entity';

describe('HU20 - Marcar favorito', () => {
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

  test('debería permitir marcar un elemento como favorito si no lo estaba antes', () => {
    const fav = new Favorite('user@example.com', 'item123');
    mockRepo.findByUserAndItem.mockReturnValueOnce(null);

    const result = service.markFavorite(fav);

    expect(result).toBe(true);
    expect(mockRepo.save).toHaveBeenCalledWith(fav);
  });

  test('no debería permitir marcar como favorito dos veces el mismo elemento', () => {
    const fav = new Favorite('user@example.com', 'item123');
    mockRepo.findByUserAndItem.mockReturnValueOnce(fav);

    expect(() => service.markFavorite(fav)).toThrow();
  });

  test('debería desmarcar un elemento favorito existente', () => {
    const fav = new Favorite('user@example.com', 'item123');
    mockRepo.findByUserAndItem.mockReturnValueOnce(fav);

    const result = service.unmarkFavorite(fav);

    expect(result).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith(fav.userEmail, fav.itemId);
  });

  test('no debería desmarcar si el elemento no está en favoritos', () => {
    const fav = new Favorite('user@example.com', 'item123');
    mockRepo.findByUserAndItem.mockReturnValueOnce(null);

    expect(() => service.unmarkFavorite(fav)).toThrow();
  });

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
