import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [UserModule, FavoritesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
