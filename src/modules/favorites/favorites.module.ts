import { Module } from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { FavoriteRepository } from './favorites.repository';

@Module({
  providers: [FavoriteService, FavoriteRepository],
  exports: [FavoriteService],
})
export class FavoritesModule {}
