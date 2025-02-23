import { Repository } from 'typeorm';

import { CustomRepository } from '../../../core/decorators/typeorm.decorator';
import { User } from '../entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * @param userId string: 이메일
   * @returns user
   */
  async findByUserId(userId: string): Promise<User> {
    const user = await this.findOne({
      where: {
        userId,
      },
    });
    return user;
  }
}
