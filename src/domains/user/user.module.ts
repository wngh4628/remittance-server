import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmExModule } from '../../core/typeorm/typeorm.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    // forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmExModule],
})
export class UserModule {}
