import { Favorite } from './favorites.entity';
import { FavoriteRepository } from './favorites.repository';

export class FavoriteService {

  constructor(private repo: FavoriteRepository) {}

  markFavorite(fav: Favorite): boolean {
    throw new Error('Not implemented');
  }

  unmarkFavorite(fav: Favorite): boolean {
    throw new Error('Not implemented');
  }

  listFavorites(userEmail: string): Favorite[] {
    throw new Error('Not implemented');
  }
}
