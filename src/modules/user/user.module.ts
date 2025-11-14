import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { InMemoryUserRepository } from './in-memory-user.repository';

@Module({
  providers: [
    UserService,
    { provide: UserRepository, useClass: InMemoryUserRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
