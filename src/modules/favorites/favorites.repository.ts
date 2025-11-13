import { Favorite } from './favorites.entity';

export class FavoriteRepository {
  save(fav: Favorite): void {
    throw new Error('Not implemented');
  }

  findByUserAndItem(userEmail: string, itemId: string): Favorite | null {
    throw new Error('Not implemented');
  }

  delete(userEmail: string, itemId: string): void {
    throw new Error('Not implemented');
  }

  listByUser(userEmail: string): Favorite[] {
    throw new Error('Not implemented');
  }
}
